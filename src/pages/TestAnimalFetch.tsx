import { useEffect, useState } from "react";

type Animal = {
    _id: string;
    name: string;
    type: string;
};

export default function TestAnimalFetch() {
    const [animals, setAnimals] = useState<Animal[]>([])
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
                {animals.map((animal) => (
                    <li key={animal._id}>{animal.name} ({animal.type})</li>
                ))}
            </ul>
        </div>
    )
}
