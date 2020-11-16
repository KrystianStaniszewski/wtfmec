import React from 'react';
import {Component} from 'react';
import "./App.css"
import Poke_Info from './PokeInfo'

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      pokemons : [],
      pokemonDetails : [],
      offset : 0,
      loadNumber : 10,
    }    
  }

  componentDidMount() {
    this.fetchPokemon();
  }
  getNextOffset() {
    return this.state.offset+this.state.loadNumber;
  }

  
  fetchPokemon() {
    
    let url = "https://pokeapi.co/api/v2/pokemon?offset=" + this.state.offset + "&limit=" + this.state.loadNumber;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data) {
        
        this.setState({pokemons : data.results}, () => {
          this.state.pokemons.map(pokemon => {
            
            fetch(pokemon.url)
            .then(response => response.json())
            .then(data => {
              if (data) {
                //console.log(data)
                var temp = this.state.pokemonDetails
                temp.push(data)
                this.setState({pokemonDetails: temp})
              }            
            })
            .catch(console.log)
          })
          console.log(data)

        })        
      }
    })
    .catch(console.log)
  }
  handleMoreClick(event) {
    const newOffset = this.getNextOffset();
    this.setState({offset: newOffset}, () => {
      console.log("Offset: " + this.state.offset)
      this.getMorePokemon();
    });    
  }

  render() {
    const {pokemonDetails} = this.state;

    const renderedPokemonList = pokemonDetails.map((pokemon, index) => {
      return (<Poke_Info pokemon={pokemon} />);
      
    });

    return (
      
      <div className="container">
        <div className="card-columns">
          {renderedPokemonList}
        </div>
      </div>
    );
  }
}

export default App;