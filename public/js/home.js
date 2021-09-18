
//obtiene la referencia al contenedor main
const main = document.querySelector(".main");

/* consigue el listado de generos */
fetch(
  genres_list_http +
    new URLSearchParams({
      api_key: api_key,
      language: 'es',
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.genres.forEach((item) => {
        fetchListaPeliculasPorGenero(item.id, item.name);
    });
  });


const fetchListaPeliculasPorGenero = (id, genres) => {
  fetch(
    movie_genres_http +
      new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        language: 'es-ES',
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
      })
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(search.value);
      construirElementoCategoria(`${genres}_movies`, data.results);
    })
    .catch((err) => console.log(err));
};

/* crea el titulo de categoria */
const construirElementoCategoria = (category, data) => {

  main.innerHTML += `
    <div class="movie-list">
        <button class="pre-btn"> <img src="img/pre.png" alt=""></button>
          
          <h1 class="movie-category">${category.split("_").join(" ")}</h1>

          <div class="movie-container" id="${category}">
          </div>

        <button class="nxt-btn"> <img src="img/nxt.png" alt=""> </button>
    </div>
    `;
    
   
  construirTarjetas(category, data);
};

const construirTarjetas = (id, data) => {
    const movieContainer = document.getElementById(id);
  data.forEach((item, i) => {
    if (item.backdrop_path == null) {
      item.backdrop_path = item.poster_path;
      if (item.backdrop_path == null) {
        return;
      }
    }

   
  let title =item.title; //Cuando el titulo no coincide es porque es una serie de tv 
  if(title==null){        //entonces para que encuentre y reconozaca se dbe convertrir el title a Name 
    title= item.name;     //eso significa que es una serie y no una pelicula y la toma
  }

    movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${title}</p>
        </div>
        `;

    if (i == data.length - 1) {
      setTimeout(() => {
        setupScrolling();
      }, 100);
    }
  });
  
  
};


function Busqueda(){

  //se limpia la pagina
    main.innerHTML = '  <header class="main">'+
  '<h1 style="color: blue;" class="heading">Pelis</h1>'+
 ' <p style="color: blue;" class="info">'+
  '  Las mejores Películas y series  de la Red, para tu Entretenimiento </p>'
'</header> '; 

  switch(filtro.value){

    case "Por Titulo":
      BuscarPorTitulo();
    break;

    case "Géneros":
      BuscarPorGeneros();
    break;

    case "Series":
      BuscarSeries();
    break;

    case "Por Año":
      BuscarPoranio();
    break;

    case "Clasificacion(R(+18),PG13,PG o G":
      BuscarPorClasificacion();
    break;

    case "Peliculas en Cine":
      BuscarPeliculasEnCine();
    break;

    case "Peliculas mayor Botadas para Adultos":
      BuscarMayorVotadas();
    break;
  }
      
     search.value = '';
}

function BuscarPorTitulo(){
  let nombre = search.value;
  fetch(
    buscar_por_titulo +
      new URLSearchParams({
        api_key: api_key,
        language: 'es-ES',
        query: nombre
      })
  )
    .then((res) => res.json()) //aqui estamos pidiendo la respuesta utilizando res.json
    .then((data) => {
        construirElementoCategoria('Buscando por Título de la Pelicula '+nombre, data.results); //mandamos a traer los datos y se concatena
    })
    .catch((err) => console.log(err));
}

function BuscarPorGeneros(){
  let generos = search.value.split(',');
    fetch(
      genres_list_http +
        new URLSearchParams({
          api_key: api_key,
          language: 'es-ES',
        })
    )
      .then((res) => res.json())
      .then((data) => {
        data.genres.forEach((item) => {
          if(generos.includes(item.name))
           { fetchListaPeliculasPorGenero(item.id, item.name);
            console.log(item);
          }
        });
      });
}



function BuscarPorClasificacion(){
  const clasificacion =search.value;
  fetch(
    movie_genres_http +
      new URLSearchParams({
        api_key: api_key,
        certification: clasificacion,
        language: 'es-ES',
        page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
      })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Clasificación De Películas '+clasificacion, data.results);
      console.log(clasificacion)
    })
    .catch((err) => console.log(err));
}

function BuscarPoranio(){
  let anio = search.value;
  fetch(
    movie_genres_http +
      new URLSearchParams({
        api_key: api_key,
        primary_release_year: anio,
        language: 'es-ES',
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
      })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria(anio, data.results);
    })
    .catch((err) => console.log(err));
}

function BuscarMayorVotadas(){
 
  fetch(
    movie_genres_http +
      new URLSearchParams({
        api_key: api_key,
        certification: 'R',
        language: 'es-ES',
        sort_by:'vote_average.desc',
        page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
      })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Las Péliculas mas Botadas para Adultos', data.results);
    })
    .catch((err) => console.log(err));
}

function BuscarSeries(){
  fetch(
    series_television +
      new URLSearchParams({
        api_key: api_key,
        language: 'es-ES',
        page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
      })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Series de Televisión', data.results);
    })
    .catch((err) => console.log(err));
}

function BuscarPeliculasEnCine(){
  fetch(
    pelis_en_cine +
      new URLSearchParams({
        api_key: api_key,
        language: 'es-ES',
        page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
      })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Películas que estan Actualmente en el Cine', data.results);
    })
    .catch((err) => console.log(err));
}
