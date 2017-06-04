var watson = require('watson-developer-cloud');
var textTranslation = "";

var language_translator = watson.language_translator({
  url: "https://gateway.watsonplatform.net/language-translator/api",
  username: 'ca0e9e32-fad5-44fb-bcd4-f02e5b19528d',
  password: 'SKqBySPZphHk',
  version: 'v2'
});

var tone_analyzer = watson.tone_analyzer({
  username: '257c328b-7704-4ea5-b7b1-9053dd012cd7',
  password: 'AL04Yo00AIse',
  version: 'v3',
  version_date: '2016-05-19'
});

function textTranslator(userText, res) {
  language_translator.translate({ text: userText, source: 'pt', target: 'en' }, function(err, translation) {
    if(err) {
      console.log(err);
    } else {
      textTranslation = translation.translations[0].translation;
      res.status(200).send(textTranslation);
    }
  });
}

function textAnalyzer(text, res) {
  tone_analyzer.tone({ text: textTranslation }, function(err, tone) {
    if (err) {
      console.log(err);
    } else {
      console.log("Traduziu");
      res.status(200).send(JSON.stringify(tone, null, 2));
    }
  });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------

    app.get('/api/todos', function (req, res) {
        textAnalyzer(textTranslation, res);
    });

    app.post('/api/todos', function (req, res) {
        textTranslator(req.body.text, res);
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        // Todo.remove({
        //     _id: req.params.todo_id
        // }, function (err, todo) {
        //     if (err)
        //         res.send(err);

        //     getTodos(res);
        // });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
