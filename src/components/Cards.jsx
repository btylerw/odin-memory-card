import { useState, useEffect, useMemo } from "react";

function Cards() {
    const [currentScore, setCurrentScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    // Array used to check if a pokemon has been clicked or not
    const [selectedCard, setSelectedCard] = useState([])
    const [data, setData] = useState([])

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
                const newData = cleanedData.sort(() => 0.5 - Math.random()).slice(0, 4 * 3);
                setData(newData);
            }
            catch(err) {
                console.error("Error fetching data from API: ", err);
            }
        }
        fetchPokemon();
    }, [])

    // Updates bestScore only if the next updated currentScore is greater
    const checkBestScore = (score) => {
        setBestScore(
            score > bestScore ? score : bestScore
        );
    }

    const handlePokemonClick = (name) => {
        if (selectedCard.includes(name)) {
            setCurrentScore(0);
            setSelectedCard([]);
        } else {
            setCurrentScore(currentScore+1);
            checkBestScore(currentScore+1);
            setSelectedCard(selectedCard => [...selectedCard, name]);
        }
    }
    // Pushes pokemon name to selectedCard if that pokemon does not exist in it
    // If pokemon name already exists, clears array and resets currentScore
    // If name does not exist, scores are updated accordingly

    // Grabs 12 random pokemon from the 386 and creates a grid of divs for each one
    // TODO: Need to randomize grid with the same pokemon. Currently repopulates grid from entire pool of 386 pokemon
    const createGrid = () => {
        const grid = data.sort(() => 0.5 - Math.random()).slice(0, 4 * 3);
        return grid.map((data, index) => {
            return (
                <div
                    key={index}
                    className="grid"
                    onClick={() => handlePokemonClick(data.name)}
                >
                    <img src={data.sprites.front_default} alt="" />
                    <p>{data.name}</p>
                </div>
            )
        })
    };

    console.log(data);
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