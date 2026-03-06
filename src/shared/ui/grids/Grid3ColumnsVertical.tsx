import { Grid, Skeleton } from "@mantine/core"

const GridSkeleton = () => {
    return (
        <Grid gutter={2} columns={3} w='100%' h='fit-content'>
            <Grid.Col span={1} h='180px'>
                <Skeleton radius={0} c='white' h='100%' w={'100%'} />
            </Grid.Col>
            <Grid.Col span={1} h='180px'>
                <Skeleton radius={0} c='white' h='100%' w={'100%'} />
            </Grid.Col>
            <Grid.Col span={1} h='180px'>
                <Skeleton radius={0} c='white' h='100%' w={'100%'} />
            </Grid.Col>

            <Grid.Col span={1} h='180px'>
                <Skeleton radius={0} c='white' h='100%' w={'100%'} />
            </Grid.Col>
            <Grid.Col span={1} h='180px'>
                <Skeleton radius={0} c='white' h='100%' w={'100%'} />
            </Grid.Col>
            <Grid.Col span={1} h='180px'>
                <Skeleton radius={0} c='white' h='100%' w={'100%'} />
            </Grid.Col>
        </Grid>
    )
}

const Grid3ColumnsVertical: React.FC<{
    isLoading?: boolean
    children: React.ReactNode
}> = ({ children, isLoading }) => {

    if (isLoading) return <GridSkeleton />

    return (
        <Grid columns={3} gutter={1} w='100%' h='fit-content'>
            {children}
        </Grid>
    )
}

export default Grid3ColumnsVertical