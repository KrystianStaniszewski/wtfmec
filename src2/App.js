import React from 'react';
import {Component} from 'react';
import "./App.css"
import PokemonList from './PokemonList';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pokemons : [],
      pokemonDetails : [],
      offset : 0,
      loadNumber : 50
    }
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
  }

  componentDidMount() {
    this.fetchPokemon();
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
    this.state.pokemonDetails.sort((a, b) => (a.id > b.id) ? 1 : -1);
  }

  handleNextClick() {
    let newOffset = this.state.offset+this.state.loadNumber;
    if(newOffset > 0 || newOffset < 1050) {
      this.setState({offset: newOffset, pokemonDetails: []}, () => {
        console.log("Offset: " + this.state.offset)
        this.fetchPokemon();
      });
    }
  }

  handlePreviousClick() {
    let newOffset = this.state.offset-this.state.loadNumber;
    if(newOffset > 0 || newOffset == 0) {
      this.setState({offset: newOffset, pokemonDetails: []}, () => {
        console.log("Offset: " + this.state.offset)
        this.fetchPokemon();
      });
    }
  }
  
  render() {
    const {pokemonDetails} = this.state;

    this.state.pokemonDetails.sort((a, b) => (a.id > b.id) ? 1 : -1);

    const renderedPokemonList = pokemonDetails.map((pokemon, index) => {
      return (<PokemonList pokemon={pokemon} />);
    });

    return (
      
      <div className="container">
        <div className="card-columns">
          {renderedPokemonList}
          <button onClick={this.handlePreviousClick}>Load Previous Page</button>
          <button onClick={this.handleNextClick}>Load Next Page</button>
        </div>
      </div>
    );
  }
}

export default App;