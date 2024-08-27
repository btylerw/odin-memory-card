import { useState, useEffect } from "react";

function Cards() {
    const [currentScore, setCurrentScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchPokemon() {
            try {
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

    const createGrid = () => {
        const grid = data.sort(() => 0.5 - Math.random()).slice(0, 4 * 3);
        return grid.map((data, index) => {
            return (
                <div
                    key={index}
                    className="grid"
                >
                    <img src={data.sprites.front_default} alt="" />
                    <p>{data.name}</p>
                </div>
            )
        })
    }

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