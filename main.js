String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getScrollPercent() {
    var h = document.documentElement, 
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
    return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
}

let next_url = null;
let is_fetching = false;

async function getNextPokemons() {
    let url = '';

    if (next_url) {
        url = next_url;
    } else {
        url = `https://pokeapi.co/api/v2/pokemon?limit=10`;
    }
    
    data = await fetch(url).then(res => res.json());

    next_url = data.next;

    return data;
}

async function getPokemonData(url) {
    return await fetch(url).then(res => res.json());;
}

function getPokemonHtml(pokemon) {
    let types_html = '';

    for (const { type } of pokemon.types) {
        types_html += `<span class='type-pill ${type.name}'>${type.name.capitalize()}</span>`
    }

    return `
        <div class="pokemon-container">
            <figure>
                <img
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name.capitalize()}"
                >
            </figure>
            <div class="pokemon-data">
                <h2>${pokemon.name.capitalize()}</h2>
                <div class="types-container">
                    ${types_html}
                </div>
            </div>
        </div>
    `;
}

async function loadPokemons() {
    if (!is_fetching) {
        is_fetching = true;

        document.getElementById('loading').classList.remove('hide');
    
        data = await getNextPokemons();

        let pokemonsHtml = '';
    
        for (const { url } of data.results) {
            const pokemon_data = await getPokemonData(url);
    
            pokemonsHtml += getPokemonHtml(pokemon_data);
        }

        document.getElementById('pokedex').innerHTML += pokemonsHtml;
        document.getElementById('loading').classList.add('hide');

        is_fetching = false;
    }
}

document.addEventListener('readystatechange', async () => {
    if (document.readyState === 'complete') {
        await loadPokemons();
    }

    setInterval(async () => {
        const scrollPercent = getScrollPercent();

        if (scrollPercent > 90) {
            loadPokemons();
        }
    }, 200);
});

// document.addEventListener('scroll', async () => {
//     const scrollPercent = getScrollPercent();

//     if (scrollPercent > 90) {
//         loadPokemons();
//     }
// });
