import { Group } from "@mantine/core"
import SearchButton from "../../../features/Search/ui/SearchButton"
import SearchInputField from "../../../features/Search/ui/SearchInputField"

const SearchForm = () => {
    return (
        <Group gap={8} wrap='nowrap' pl={16}>
            <SearchInputField w='100%' autoFocus={true} />
            <SearchButton />
        </Group>
    )
}

export default SearchForm