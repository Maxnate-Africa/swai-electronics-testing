import type { Filters } from '../types';

interface Props {
  filters: Filters | null;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showSaleOnly: boolean;
  onSaleToggle: (show: boolean) => void;
}

export default function FilterBar({ filters, selectedCategory, onCategoryChange, showSaleOnly, onSaleToggle }: Props) {
  if (!filters) return null;

  return (
    <div className="filter-bar">
      <div className="categories">
        {filters.show_all_link && (
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => onCategoryChange('all')}
          >
            {filters.all_label}
          </button>
        )}
        
        {filters.categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filters.show_sale_filter && (
        <button
          className={`sale-filter ${showSaleOnly ? 'active' : ''}`}
          onClick={() => onSaleToggle(!showSaleOnly)}
        >
          {filters.sale_label}
        </button>
      )}
    </div>
  );
}
