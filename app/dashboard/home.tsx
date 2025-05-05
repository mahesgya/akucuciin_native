import { View } from "react-native"
import HeaderHome from "../ui/home/header"
import SearchBar from "../ui/home/searchBar"
import { useState } from "react"

const Dashboard = () => {
    const [query, setQuery] = useState("");
    
    const handleSearch = () => {
        
    }

    return(
        <View>
            <HeaderHome title={"PESANAN"} totalAmount={298000}/>
            <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch}/>
        </View>
    )
}

export default Dashboard