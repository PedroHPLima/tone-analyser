angular.module('todoController', []).controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
	$scope.formData = {};
		$scope.spinner = false;
		$scope.toneAnalyzed = {};
		$scope.document = [];
		$scope.sentence = [];
		$scope.emotionScoreArray = [];
		$scope.emotionalToneNames = [];
		$scope.languageScoreArray = [];
		$scope.languageToneNames = [];
		$scope.socialScoreArray = [];
		$scope.socialToneNames = [];
		$scope.TranslatedCategories = [];
		$scope.userText = [];
		$scope.userFinalText = [];
		$scope.emotionalSentences = [];
		$scope.emotionalSentencesScores = [];
		$scope.languageSentences = [];
		$scope.languageSentencesScores = [];
		$scope.socialSentences = [];
		$scope.socialSentencesScores = [];
		$scope.toneInfo = "";
		
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			$scope.userText = [];
			$scope.userFinalText = [];
			$scope.emotionalSentences = [];
			$scope.emotionalSentencesScores = [];
			$scope.languageSentences = [];
			$scope.languageSentencesScores = [];
			$scope.socialSentences = [];
			$scope.socialSentencesScores = [];
			$scope.toneInfo = "";
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.spinner = true;

				$scope.userFinalText = $scope.formData.text.match( /[^\.!\?]+[\.!\?]+/g );
				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						//$scope.userText = $scope.formData.split(".");
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
						Todos.get()
							.success(function(data) {
								$scope.spinner = false;
								$scope.toneAnalyzed = data;

								$scope.document.emotionTone = $scope.toneAnalyzed.document_tone.tone_categories[0];
								$scope.document.languageTone = $scope.toneAnalyzed.document_tone.tone_categories[1];
								$scope.document.socialTone = $scope.toneAnalyzed.document_tone.tone_categories[2];
								$scope.TranslatedCategories = ['Tom Emocional', 'Tom de linguagem', 'Tendência Social'];

								$scope.sentence = $scope.toneAnalyzed.sentences_tone;

								createEmotionChart($scope.document.emotionTone);
								createLanguageChart($scope.document.languageTone);
								createSocialChart($scope.document.socialTone);

								// console.log($scope.sentence);

								//console.log(JSON.stringify($scope.toneAnalyzed.sentences_tone));
							})
							.error(function(error) {
								$scope.spinner = false;
								console.log(error);
							});
					});
			}
		};

		function emotionalSentences(tone) {
			$scope.emotionalSentences = [];
			$scope.emotionalSentencesScores = [];
			$scope.languageSentencesScores = [];
			$scope.socialSentencesScores = [];

			$scope.sentence.forEach(function(s) {
				$scope.emotionalSentences.push(s.tone_categories[0].tones.filter(function(obj) {
					return obj.tone_id == tone;
				}));
			});

			$scope.emotionalSentences.forEach(function(s) {
				var i = 0;
				$scope.emotionalSentencesScores.push(s[i].score.toFixed(2));
				i++;
			});
		};

		function languageSentences(tone) {
			$scope.languageSentences = [];
			$scope.languageSentencesScores = [];
			$scope.emotionalSentencesScores = [];
			$scope.socialSentencesScores = [];

			$scope.sentence.forEach(function(s) {
				$scope.languageSentences.push(s.tone_categories[1].tones.filter(function(obj) {
					return obj.tone_id == tone;
				}));
			});

			$scope.languageSentences.forEach(function(s) {
				var i = 0;
				$scope.languageSentencesScores.push(s[i].score.toFixed(2));
				i++;
			});

			// console.log($scope.languageSentences);
			// console.log($scope.languageSentencesScores);
		};

		function socialSentences(tone) {
			$scope.socialSentences = [];
			$scope.socialSentencesScores = [];
			$scope.languageSentencesScores = [];
			$scope.emotionalSentencesScores = [];

			$scope.sentence.forEach(function(s) {
				$scope.socialSentences.push(s.tone_categories[2].tones.filter(function(obj) {
					return obj.tone_id == tone;
				}));
			});

			$scope.socialSentences.forEach(function(s) {
				var i = 0;
				$scope.socialSentencesScores.push(s[i].score.toFixed(2));
				i++;
			});

			console.log($scope.socialSentences);
		};

		function sentenceStyle(tone, sentence) {
			$scope.myVar = true;
			console.log(sentence);
		};

		function createEmotionChart(array) {
			$scope.emotionScoreArray = [];
			$scope.emotionalToneNames = [];
			array.tones.forEach(function(a) {
				$scope.emotionScoreArray.push(a.score.toFixed(2));
			});

			$scope.emotionalToneNames = ['Raiva', 'Nojo', 'Medo', 'Alegria', 'Tristeza'];
		};

		function createLanguageChart(array) {
			$scope.languageScoreArray = [];
			$scope.languageToneNames = [];

			array.tones.forEach(function(a) {
				$scope.languageScoreArray.push(a.score.toFixed(2));
			});

			$scope.languageToneNames = ['Analítico', 'Confiante', 'Tentativo'];
		};

		function createSocialChart(array) {
			$scope.socialScoreArray = [];
			$scope.socialToneNames = [];

			array.tones.forEach(function(a) {
				$scope.socialScoreArray.push(a.score.toFixed(2));
			});

			$scope.socialToneNames = ['Abertura', 'Conscien.', 'Extraversão', 'Amabilidade', 'Neuroticismo'];
		};

		$scope.sentenceChoice = function(tone) {
			$scope.toneInfo = "";
			$scope.toneInfo = tone;
			emotionalSentences(tone);
		};

		$scope.sentenceChoicelanguage = function(tone) {
			$scope.toneInfo = "";
			$scope.toneInfo = tone;
			languageSentences(tone);
		};

		$scope.sentenceChoiceSocial = function(tone) {
			$scope.toneInfo = "";
			$scope.toneInfo = tone;
			socialSentences(tone);
		};

		$scope.options = {
				    scales: {
				        yAxes: [{
				            display: true,
				            ticks: {
				                max: 1,
				                min: 0,
				                stepSize: 0.1
				            }
				        }]
				    }
		};
		
}])