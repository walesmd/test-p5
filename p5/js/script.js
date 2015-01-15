function loadData() {

  var $body = $('body'),
  $wikiElem = $('#wikipedia-links'),
  $nytHeaderElem = $('#nytimes-header'),
  $nytElem = $('#nytimes-articles'),
  $greeting = $('#greeting');

  // clear out old data before new request
  $wikiElem.text('');
  $nytElem.text('');



  /* BEGIN SECTION: Google Street View
  * Google Street View API:
  * https://developers.google.com/maps/documentation/streetview
  */

  var streetString, cityString, locationString, urlStreetView;

  // These two lines get the user's input.
  streetString = $('#street').val();
  cityString = $('#city').val();

  // Conditional/ternary operator creates a 'Street, City' or a 'City' location
  // string as appropriate.
  locationString = (streetString.length > 0) ?
  streetString + ', ' + cityString :
  cityString;

  // This builds the URL for a Street View image resource.
  urlStreetView = 'http://maps.googleapis.com/maps/api/streetview?size=600x40' +
    '0&location=' + locationString;

  // This places the Street View image on the page.
  $body.append('<img class="bgimg" src="' + urlStreetView + '">');

  /* END SECTION: Google Street View */



  /* BEGIN SECTION: New York Times Articles
  * NY Times developer API:
  * http://developer.nytimes.com/docs
  */

  var urlNYT;

  /* THIS CODE USES MY TRUE API KEY
  urlNYT = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
  cityString + '&api-key=30eb270dbc8954549a8f43b3c444585e:17:68821162';
  */

  // This code uses the API Key I found from a random person on GitHub at:
  // https://github.com/Eric-Xu/headline_ctr_prediction/blob/3990bae4e3f6d703e01795c3a3507eafdf4323c3/nytimes_articles_api.txt
  // The search I used to find random people's NYTimes API key is:
  // https://github.com/search?q=api.nytimes.com%2Fsvc%2Fsearch%2Fv2%2Farticlesearch.json+api-key&type=Code
  urlNYT = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
    cityString + '&api-key=e7f754fbb084a342de0efe77f721de64:11:70185922';

  // This is the line that starts (and sees finished) the process of fetching
  // and rendering NYT articles on the page.
  $.getJSON(urlNYT, successHandler).error(errorHandler);


  function successHandler(responseObject) {
    var articleArray, webURL, headline, snippet, articleHTML;

    $nytHeaderElem.text('New York Times Articles On ' + cityString + ':');

    articleArray = responseObject.response.docs;

    articleArray.forEach(appendArticle);


    function appendArticle(article) {
      webURL = article.web_url;
      headline = article.headline.main;
      snippet = article.snippet;

      articleHTML = '<li class="article"><a href="' + webURL + '"' + '>' +
        headline + '</a>' + '<p>' + snippet + '</p></li>';

      $nytElem.append(articleHTML)
    }
  }

  function errorHandler() {
    $nytHeaderElem.text('Articles from The New York Times on ' + cityString +
      ' Could Not Be Loaded.');
  }

  /* END SECTION: New York Times Articles */



  /* BEGIN SECTION: Wikipedia Articles
  * Developer API:
  * https://www.mediawiki.org/wiki/API:Main_page
  */

  var urlWikip;

  // This is the line that starts (and sees finished) the process of fetching
  // and rendering links to Wikipedia articles on the page.
  $.ajax({
    url: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
      cityString + '&format=json',

    dataType: 'jsonp',

    success: function(responseObject) {
      var pagesObject;

      pagesArray = responseObject[1];

      pagesArray.forEach(appendWikipediaLink);
    }
  });

  function appendWikipediaLink(member) {
    $wikiElem.append('<li><a href="http://en.wikipedia.org/w/index.php?title=' +
      member + '">' + member + '</a></li>');
  }

  /* END SECTION: Wikipedia Articles */



  return false;
};

$('#form-container').submit(loadData);
