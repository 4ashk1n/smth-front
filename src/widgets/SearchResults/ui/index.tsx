import { Grid, Skeleton, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";
import ArticleCard from "../../../entities/article/ui/ArticleCard/ArticleCard";
import UserCard from "../../../entities/user/ui/UserCard";
import { useSearchStore } from "../../../features/Search/contexts/Search.context";
import SearchTabs from "../../../features/Search/ui/SearchTabs";
import Grid3ColumnsVertical from "../../../shared/ui/grids/Grid3ColumnsVertical";
import CategoryCard from "../../CategoryCard/ui";

const ArticlesLoadingMore = () => (
    <Grid columns={3} gutter={1} w="100%">
        {Array.from({ length: 3 }).map((_, i) => (
            <Grid.Col key={i} span={1} h={180}>
                <Skeleton h="100%" radius={0} />
            </Grid.Col>
        ))}
    </Grid>
);

const ListLoading = () => (
    <Stack px={0} w="100%" gap={8}>
        {Array.from({ length: 5 }).map((_, i) => (
            <UserCard key={i} loading />
        ))}
    </Stack>
);

const CategoriesLoading = () => (
    <Stack px={16} w="100%" gap={8}>
        {Array.from({ length: 5 }).map((_, i) => (
            <CategoryCard key={i} loading variant="list" />
        ))}
    </Stack>
);

const SearchResults = observer(() => {
    const store = useSearchStore();
    const navigate = useNavigate();
    const currentTabState = store.results[store.currentTab];
    const articlesState = store.results.articles;
    const usersState = store.results.users;
    const categoriesState = store.results.categories;

    if (!store.hasSearched) return null;

    return (
        <Stack
            align="center"
            w="100%"
            gap={0}
        >
            <SearchTabs />

            {
                store.currentTab === "articles" ? (
                    <>
                        <Grid3ColumnsVertical isLoading={articlesState.loading}>
                            {articlesState.results.map((article) => (
                                <Grid.Col span={1} key={article.id} h={180}>
                                    <ArticleCard
                                        variant="vertical"
                                        article={article}
                                        onClick={() => navigate(`/article/${article.id}`)}
                                    />
                                </Grid.Col>
                            ))}
                        </Grid3ColumnsVertical>
                        {articlesState.loadingMore && <ArticlesLoadingMore />}
                    </>
                ) : null
            }

            {
                store.currentTab === "users" ? (
                    <Stack w="100%" gap={8}>
                        {usersState.loading ? <ListLoading /> : null}
                        {!usersState.loading && usersState.results.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onClick={() => navigate(`/profile/${user.id}`)}
                            />
                        ))}
                        {usersState.loadingMore ? <ListLoading /> : null}
                    </Stack>
                ) : null
            }

            {
                store.currentTab === "categories" ? (
                    <Stack w="100%" gap={8}>
                        {categoriesState.loading ? <CategoriesLoading /> : null}
                        {!categoriesState.loading && (
                            <Stack px={16} w="100%" gap={8}>
                                {categoriesState.results.map((category) => (
                                    <CategoryCard key={category.id} category={category} variant="list" />
                                ))}
                            </Stack>
                        )}
                        {categoriesState.loadingMore ? <CategoriesLoading /> : null}
                    </Stack>
                ) : null
            }

            {currentTabState.loaded && !currentTabState.loading && currentTabState.results.length === 0 ? (
                <Text py={24} opacity={0.7}>
                    Ничего не найдено
                </Text>
            ) : null}

        </Stack>
    );
});

export default SearchResults;
