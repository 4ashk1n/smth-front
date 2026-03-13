import { ScrollArea, Stack } from "@mantine/core"
import { observer } from "mobx-react"
import { useRef } from "react"
import SearchStoreProvider, { useSearchStore } from "../../../features/Search/contexts/Search.context"
import DarkGradientBackground from "../../../shared/ui/blocks/DarkGradientBackground"
import SearchForm from "../../../widgets/SearchForm/ui"
import SearchResults from "../../../widgets/SearchResults/ui"

const SearchPageContent = observer(() => {
    const store = useSearchStore()
    const viewportRef = useRef<HTMLDivElement>(null)

    const onScroll = ({ y }: { x: number; y: number }) => {
        const viewport = viewportRef.current
        if (!viewport) return

        const distanceToBottom = viewport.scrollHeight - (y + viewport.clientHeight)
        if (distanceToBottom <= 400) {
            void store.loadMore()
        }
    }

    return (
        <ScrollArea
            scrollbars="y"
            type="scroll"
            h="calc(100vh)"
            scrollbarSize={0}
            viewportRef={viewportRef}
            onScrollPositionChange={onScroll}
        >
            <DarkGradientBackground accentColor={'#004c94'} />

            <Stack mt={24} gap={16}>
                <SearchForm />
                <SearchResults />
            </Stack>

            <div style={{ height: 100 }} />
        </ScrollArea>
    )
})

const SearchPage = () => {
    return (
        <SearchStoreProvider>
            <SearchPageContent />
        </SearchStoreProvider>
    )
}

export default SearchPage
