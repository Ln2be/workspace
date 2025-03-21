document.addEventListener("DOMContentLoaded", function () {
  // Load templates from separate files
  fetch("common-partial.hbs")
    .then((response) => response.text())
    .then((template) => {
      document.getElementById("commonPartial").innerHTML = template;
      Handlebars.registerPartial("commonPartial", template);
    });

  fetch("page-template.hbs")
    .then((response) => response.text())
    .then((template) => {
      document.getElementById("pageTemplate").innerHTML = template;
      var pageTemplate = Handlebars.compile(template);

      // Define the data
      var data = { name: "World" };

      // Render the template with the data
      var result = pageTemplate(data);

      // Insert the result into the document
      document.body.innerHTML += result;
    });
});
