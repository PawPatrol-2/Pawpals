import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import { mockAnimals } from "../data/mockAnimals";


export default function ExplorePage() {
    return(
        <main>
            <AnimalGrid animals={mockAnimals} />
        </main>
    )
}