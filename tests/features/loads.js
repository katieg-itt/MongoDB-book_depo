module.exports = {
  'Testing loading on heroku' : function (client) {
    client
      .url('https://warm-waters-74555.herokuapp.com/')
      .waitForElementVisible('body', 1000)
      .assert.containsText('#book_Depository .book-title h3', 'Book Depository')
      .end();
  }
};