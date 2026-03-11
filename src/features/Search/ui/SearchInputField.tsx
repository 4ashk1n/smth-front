import { TextInput, type TextInputProps } from "@mantine/core"
import type React from "react"
import { PiMagnifyingGlassBold } from "react-icons/pi"
import { useSearchStore } from "../contexts/Search.context"

const SearchInputField: React.FC<TextInputProps & { ref?: React.Ref<HTMLInputElement>}> = (props) => {
    const store = useSearchStore();
    return (
        <TextInput
            variant="default"
            radius={5}
            placeholder="Поиск"
            size="sm"
            leftSection={<PiMagnifyingGlassBold size={16} />}
            onChange={(e) => store.setQuery(e.target.value)}
            styles={{
                input: {
                    background: 'black'
                },
            }}
            {...props}
        />
    )
}

export default SearchInputField