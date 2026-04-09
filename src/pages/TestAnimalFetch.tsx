import { useEffect, useState } from "react";

export default function TestAnimalFetch() {
    const [animals, setAnimals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await fetch('/api/animals');
                const data = await res.json();
                setAnimals(data)
            } catch {
                setError('Kunde inte hämta djur från servern')
            } finally {
                setLoading(false)
            }
        }
        fetchAnimals()
    }, [])

    if(loading) return <div>Laddar...</div>
    if(error) return <div>{error}</div>

    return(
        <div>
            <h1>Djur</h1>
            <ul>
                {animals.map((animals: any) => (
                    <li key={animals._id}>{animals.name} ({animals.type})</li>
                ))}
            </ul>
        </div>
    )
}