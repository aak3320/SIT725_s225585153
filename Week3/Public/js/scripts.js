const bookList = [
    {
        title: "Database System Concepts",
        image: "images/Book2.png",
        link: "View more",
        description: "<strong>Author:</strong> Abraham Silberschatz<br/><strong>Genre:</strong> Databases<br/><br/>Provides a detailed introduction to database systems, SQL, transaction management, and database design principles."
    },
    {
        title: "Deep Work",
        image: "images/Book3.png",
        link: "more",
        description: "<strong>Author:</strong> Cal Newport<br/><strong>Genre:</strong> Productivity<br/><br/>Rules for focused success in a distracted world — a must-read for anyone serious about doing their best work."
    }
];

const submitForm = () => {
    const formData = {}
    formData.first_name = $('#first_name').val();
    formData.last_name = $('#last_name').val();
    formData.email = $('#email').val();

    console.log("Form Data Submitted:", formData);
};

const addCards = (items) => {
    items.forEach(item => {
        const card = `
      <div class="col s12 m6 l4 center-align">
        <div class="card medium book-card">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${item.image}" alt="${item.title}"/>
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              ${item.title}
              <i class="material-icons right">more_vert</i>
            </span>
            <p><a href="#">${item.link}</a></p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              ${item.title}
              <i class="material-icons right">close</i>
            </span>
            <p class="card-text">${item.description}</p>
          </div>
        </div>
      </div>`;
        $("#card-section").append(card);
    });
};

$(document).ready(function () {
    $('.materialboxed').materialbox();
    addCards(bookList);
    $('.modal').modal();
    $('#formSubmit').click(() => {
        submitForm();
    })
});
