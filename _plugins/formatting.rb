module Jekyll
  module FormattingFilters
    def format_price(input)
      return '' if input.nil?
      # Remove any non-digit characters except decimal point
      cleaned = input.to_s.strip.gsub(/[^0-9.]/,'')
      return '' if cleaned.empty?
      # Prefer integer formatting for TSh (no decimals)
      num = cleaned.to_f
      int_part = num.round
      formatted = int_part.to_s.reverse.scan(/\d{1,3}/).join(',').reverse
      "TSh #{formatted}"
    end

    def format_price_raw(input)
      return '' if input.nil?
      cleaned = input.to_s.strip.gsub(/[^0-9.]/,'')
      return '' if cleaned.empty?
      num = cleaned.to_f
      int_part = num.round
      int_part.to_s.reverse.scan(/\d{1,3}/).join(',').reverse
    end

    def calculate_discount(original_price, sale_price)
      return 0 if original_price.nil? || sale_price.nil?
      orig = original_price.to_f
      sale = sale_price.to_f
      return 0 if orig <= 0 || sale <= 0 || sale >= orig
      ((orig - sale) / orig * 100).round
    end

    def format_savings(original_price, sale_price)
      return '' if original_price.nil? || sale_price.nil?
      orig = original_price.to_f
      sale = sale_price.to_f
      return '' if orig <= 0 || sale <= 0 || sale >= orig
      savings = (orig - sale).round
      formatted = savings.to_s.reverse.scan(/\d{1,3}/).join(',').reverse
      "Save TSh #{formatted}"
    end

    def is_on_sale(product)
      # Handle both nested pricing_info and flat structure
      pricing = product['pricing_info'] || product
      
      return false unless pricing['sale_price'] && pricing['price']
      return false if pricing['sale_price'].to_f >= pricing['price'].to_f
      
      # Check date range if specified
      now = Time.now
      begin
        if pricing['sale_start']
          return false if now < Time.parse(pricing['sale_start'].to_s)
        end
        if pricing['sale_end']
          return false if now > Time.parse(pricing['sale_end'].to_s)
        end
      rescue StandardError
        # If date parsing fails, assume sale is active
      end
      
      true
    end

    def get_effective_price(product)
      pricing = product['pricing_info'] || product
      
      if is_on_sale(product)
        pricing['sale_price']
      else
        pricing['price']
      end
    end

    def get_product_price(product, price_type = 'price')
      pricing = product['pricing_info'] || product
      pricing[price_type] || product[price_type]
    end
  end
end

Liquid::Template.register_filter(Jekyll::FormattingFilters)
