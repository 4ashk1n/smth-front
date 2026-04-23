import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ArticleStoreProvider from "../../../entities/article/contexts/article.context";
import { ArticleModel } from "../../../entities/article/models/article.model";
import { useCategoriesStore } from "../../../entities/category/contexts/categories.context";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";
import { getArticleById } from "../../../features/EditArticle/api/getArticleById";
import { getReviewRemarksSuggestions } from "../../../features/EditArticle/api/getReviewRemarksSuggestions";
import ArticleScreen from "../../Article/ui/screen";

const NewArticlePage = observer(() => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const categories = useCategoriesStore();
  const [article, setArticle] = useState<ArticleModel | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/profile");
      return;
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const articleModel = new ArticleModel(categories);

    getArticleById(id)
      .then(async (articleDTO) => {
        if (cancelled) return;
        articleModel.fromDTO(articleDTO);

        if (!cancelled) {
          setArticle(articleModel);
        }

        try {
          const remarks = await getReviewRemarksSuggestions(articleDTO.id);
          if (!cancelled) {
            articleModel.setAISuggestions(remarks.suggestions);
          }
        } catch (error) {
          console.error("Failed to load moderation remarks", error);
        }
      })
      .catch((error) => {
        console.error("Failed to load article", error);
      });

    return () => {
      cancelled = true;
    };
  }, [id, categories]);

  if (!article) return null;

  return (
    <>
      <ArticleStoreProvider article={article} editMode>
        <ArticleScreen />
      </ArticleStoreProvider>
    </>
  );
});

export default NewArticlePage;
