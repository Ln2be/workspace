document.addEventListener("DOMContentLoaded", function () {
  // Compile common code template
  var commonCodeTemplate = Handlebars.compile(
    document.getElementById("commonCodeTemplate").innerHTML
  );
  var commonCodeHtml = commonCodeTemplate();

  // Render common code
  document.getElementById("commonCodeContainer").innerHTML = commonCodeHtml;

  // Compile page template
  var page1Template = Handlebars.compile(
    document.getElementById("page1Template").innerHTML
  );
  var page1Html = page1Template({ commonCode: commonCodeHtml });

  // Render page
  // Append or replace the content where needed
  document.body.innerHTML += page1Html;
});
