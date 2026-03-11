import { Button } from "@mantine/core";
import { observer } from "mobx-react";
import { useSearchStore } from "../contexts/Search.context";

const SearchButton: React.FC<{}> = observer(() => {
    const store = useSearchStore();
    return (
        <Button
            size='sm'
            variant="transparent"
            miw='fit-content'
            radius={5}
            px={16}
            fw={600}
            loading={store.loading}
            onClick={() => store.search()}
            opacity={store.searchAllowed ? '1' : '0.5'}
        >
            Поиск
        </Button>
    )
})

export default SearchButton