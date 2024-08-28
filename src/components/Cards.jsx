import { useState, useEffect, useMemo } from "react";

function Cards() {
    const [currentScore, setCurrentScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    // Array used to check if a pokemon has been clicked or not
    const [selectedCard, setSelectedCard] = useState([])
    // Will contain all gen 1-3 Pokemon
    const [data, setData] = useState([])
    // Will only contain 12 of the pokemon from data
    const [pokemon, setPokemon] = useState([])
    // Boolean that is flipped when game is lost to signal board reset
    const [reset, setReset] = useState(false);

    useEffect(() => {
        async function fetchPokemon() {
            try {
                // Grabs info for only Gens 1-3 (the best ones)
                const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=386');
                const data = await res.json();
                const cleanedData = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const detailedRes = await fetch(pokemon.url);
                        return await detailedRes.json();
                    })
                )
                setData(cleanedData);
            }
            catch(err) {
                console.error("Error fetching data from API: ", err);
            }
        }
        fetchPokemon();
    }, [])

    // Takes info from API fetch and randomly grabs 12 to use for game
    // Resets when game is lost
    useEffect(() => {
        async function assignPokemon() {
            try {
                const newData = data.sort(() => 0.5 - Math.random()).slice(0, 4 * 3);
                setPokemon(newData);
            }
            catch(err) {
                console.error("Error assigning pokemon: ", err);
            }
        }
        assignPokemon();
    }, [reset, data])

    // Updates bestScore only if the next updated currentScore is greater
    const checkBestScore = (score) => {
        setBestScore(
            score > bestScore ? score : bestScore
        );
    }

    // Pushes pokemon name to selectedCard if that pokemon does not exist in it
    // If pokemon name already exists, clears array and resets currentScore
    // If name does not exist, scores are updated accordingly
    const handlePokemonClick = (name) => {
        if (selectedCard.includes(name)) {
            setCurrentScore(0);
            setSelectedCard([]);
            setReset(!reset);
        } else {
            setCurrentScore(currentScore+1);
            checkBestScore(currentScore+1);
            setSelectedCard(selectedCard => [...selectedCard, name]);
        }
    }

    // Grabs 12 random pokemon from the 386 and creates a grid of divs for each one
    const createGrid = () => {
        const grid = pokemon.sort(() => 0.5 - Math.random()).slice(0, 4 * 3);
        return grid.map((pokemon, index) => {
            return (
                <div
                    key={index}
                    className="grid"
                    onClick={() => handlePokemonClick(pokemon.name)}
                >
                    <img src={pokemon.sprites.front_default} alt="" />
                    <p>{pokemon.name}</p>
                </div>
            )
        })
    };

    return (
        <>
            <div>
                <p>Current Score: {currentScore}</p>
                <p>Best Score: {bestScore}</p>
                <div className="gridBox">
                    {createGrid()}
                </div>
            </div>
        </>
    )
}

export default Cards;
