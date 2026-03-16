import { useSuspenseCategories } from '@/entities/category'
import {
    CategoriesTable,
    CategoryDialogs,
    CreateCategoryButton,
} from '@/features/category'
import { Stack } from '@/shared/ui/Stack'

export const CategoriesPage = () => {
    const {
        data: { categories },
    } = useSuspenseCategories()
    return (
        <section>
            <Stack className="container" direction={'column'}>
                <Stack>
                    <CreateCategoryButton />
                </Stack>
                <Stack className="max-w-screen-sm">
                    <CategoriesTable categories={categories} />
                </Stack>
            </Stack>
            <CategoryDialogs />
        </section>
    )
}
