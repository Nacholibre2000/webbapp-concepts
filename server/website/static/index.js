function deleteConcept(conceptId) {
  fetch("/delete-concept", {
    method: "POST",
    body: JSON.stringify({ conceptId: conceptId }),
  }).then((_res) => {
    window.location.href = "/";
  });
}