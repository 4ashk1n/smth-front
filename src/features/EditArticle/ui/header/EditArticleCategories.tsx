import { useContext, useEffect, useState } from "react"
import { ArticleContext } from "../../../stores/ArticleStore"
import { useCombobox, Pill, Combobox, Group, CheckIcon, PillsInput } from "@mantine/core";
import { ALL_CATEGORIES } from "../../../../entities/category/samples/AllCategories";
import type { Category } from "../../../../entities/category/types/Category";

const EditArticleCategories = () => {
    const { article, editCategories } = useContext(ArticleContext)

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');
    const [value, setValue] = useState<Category[]>(article.categories);

    const handleValueSelect = (val_: string) => {
        const val = ALL_CATEGORIES.find((item) => item.name === val_);
        if (!val) return
        setValue((current) =>
            current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
        );
    }
    const handleValueRemove = (val: Category) =>{
        setValue((current) => current.filter((v) => v !== val));
    }

    useEffect(() => {
        editCategories(value)
    }, [value])

    const values = value.map((item, i) => (
        <Pill
            key={item.id}
            withRemoveButton
            onRemove={() => handleValueRemove(item)}
            size={i === 0 ? 'lg' : 'sm'}
            style={{
                backgroundColor: item.lightColor,
                fontSize: i === 0 ? 16 : 12,
                fontWeight: 500,
                color: item.darkColor
            }}
        >
            {item.emoji} {item.name}
        </Pill>
    ));

    const options = ALL_CATEGORIES
        .filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item: Category) => (
            <Combobox.Option bg={'#00000080'} p={0} value={item.name} key={item.id} active={value.includes(item)}>
                <Group gap="sm" p={10} bg={item.lightColor}>
                    {value.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item.emoji} {item.name}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.DropdownTarget>
                <PillsInput
                    size="lg"
                    variant="unstyled"
                    onClick={() => combobox.openDropdown()}
                    styles={{
                        input: {
                            color: 'white'
                        }
                    }}
                >
                    <Pill.Group style={{ alignItems: 'end'}}>
                        {values}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder="Search values"
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0 && value.length > 0) {
                                        event.preventDefault();
                                        handleValueRemove(value[value.length - 1]);
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown style={{ background: '#00000080', outline: 'none', border: 'none' }}>
                <Combobox.Options  mah={300} style={{ overflowY: 'auto', background: '#00000080' }}>
                    {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
    return (<>

    </>)
}

export default EditArticleCategories