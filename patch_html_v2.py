import os

workspace = r"c:\Users\User\Downloads\cozyloopWeb"
files = ["index.html", "about.html", "shop.html", "custom.html", "cart.html"]

for fname in files:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Common badge updates (e.g. CURATED PICKS, TECHNICAL GRID, cartBadgeCount)
    content = content.replace(
        'style="background: var(--black); color: var(--brand-green); padding: 4px 8px;"',
        'style="background: var(--brand-green); color: var(--white); padding: 4px 8px;"'
    )
    content = content.replace(
        'style="background: var(--black); color: var(--brand-green); padding: 2px 8px;"',
        'style="background: var(--brand-green); color: var(--white); padding: 2px 8px;"'
    )
    
    # index.html changes
    if fname == "index.html":
        # Rename brutalist-list and brutalist-card to resolve nested-cards and visual naming warnings
        content = content.replace('class="brutalist-list"', 'class="products-list"')
        content = content.replace('class="brutalist-card"', 'class="product-item"')
        content = content.replace('class="brutalist-card__index"', 'class="product-item__index"')
        content = content.replace('class="brutalist-card__media"', 'class="product-item__media"')
        content = content.replace('class="brutalist-card__info"', 'class="product-item__info"')
        content = content.replace('class="brutalist-card__title"', 'class="product-item__title"')
        content = content.replace('class="brutalist-card__tags"', 'class="product-item__tags"')
        content = content.replace('class="brutalist-card__arrow"', 'class="product-item__arrow"')
        
        # Clean inline styling of best sellers list
        content = content.replace(
            'style="border-bottom: var(--border-width) solid var(--black); background: transparent; border: none; box-shadow: none;"',
            'style="display: flex; flex-direction: column; gap: 16px; margin: 32px 0;"'
        )
        # Clean product item inline style (no inline borders/colors)
        content = content.replace(
            'style="padding: 24px; border-top: var(--border-width) solid var(--black); background: var(--bg-card); border: var(--border-width) solid var(--border-color); cursor: pointer;"',
            'class="product-item"'
        )
        content = content.replace(
            'style="width: 110px; height: 110px; border: var(--border-width) solid var(--black);"',
            'class="product-item__media"'
        )
        content = content.replace(
            'style="flex: 1; padding-left: 20px;"',
            'class="product-item__info"'
        )
        content = content.replace(
            'style="font-size: 1.8rem;"',
            'class="product-item__title"'
        )
        content = content.replace(
            'style="margin-top: 8px;"',
            'class="product-item__tags"'
        )
        content = content.replace(
            'style="font-size: 1.5rem; font-weight: 700;"',
            'class="product-item__arrow"'
        )
        # Clean custom request banner border
        content = content.replace(
            'style="padding: 72px 24px; border-bottom: var(--border-width) solid var(--black);"',
            'style="padding: 72px 24px; border-bottom: var(--border-width) solid var(--border-color);"'
        )

    # about.html changes
    if fname == "about.html":
        # Manifesto colors (use text-primary/secondary instead of white on cream bg)
        content = content.replace(
            'style="color: var(--white); font-size: clamp(3rem, 7vw, 5rem); line-height: 1.1; margin: 0; text-transform: uppercase;"',
            'style="color: var(--text-primary); font-size: clamp(3rem, 7vw, 5rem); line-height: 1.1; margin: 0; text-transform: uppercase;"'
        )
        content = content.replace(
            'style="color: var(--white); opacity: 0.9; font-size: 1.15rem; max-width: 28em; margin-top: 16px; font-weight: 500;"',
            'style="color: var(--text-secondary); opacity: 0.9; font-size: 1.15rem; max-width: 28em; margin-top: 16px; font-weight: 500;"'
        )
        # Blockquote text color
        content = content.replace(
            'style="font-family: var(--font-display); font-size: 1.35rem; line-height: 1.5; color: var(--white); font-weight: 800;"',
            'style="font-family: var(--font-display); font-size: 1.35rem; line-height: 1.5; color: var(--text-primary); font-weight: 800;"'
        )
        # Stats number color
        content = content.replace('class="stat-num"', 'class="stat-num"')
        
        # Technical grid table color details
        content = content.replace(
            'style="background: var(--black); color: var(--brand-green); font-family: var(--font-mono); font-weight: 700; border-bottom: var(--border-width) solid var(--border-color);"',
            'style="background: var(--black); color: var(--white); font-family: var(--font-mono); font-weight: 700; border-bottom: var(--border-width) solid var(--border-color);"'
        )
        content = content.replace(
            'style="overflow-x: auto; border: var(--border-width) solid var(--black); background: var(--bg-card); border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow-brutal); padding: 16px;"',
            'style="overflow-x: auto; border: var(--border-width) solid var(--border-color); background: var(--bg-card); box-shadow: var(--shadow-brutal); padding: 16px;"'
        )

    # custom.html changes
    if fname == "custom.html":
        # Badge: Commissions / Custom Crafts on Sage background
        content = content.replace(
            'style="display: inline-block; font-family: var(--font-mono); font-size: 0.85rem; background: var(--brand-green); color: var(--black); padding: 4px 10px; font-weight: 700; margin-bottom: 16px;"',
            'style="display: inline-block; font-family: var(--font-mono); font-size: 0.85rem; background: var(--black); color: var(--white); padding: 4px 10px; font-weight: 700; margin-bottom: 16px;"'
        )
        # Hero text color description (inherit white instead of green on green)
        content = content.replace(
            'style="opacity: 0.9; font-size: 1.2rem; max-width: 32em; margin-top: 16px; font-weight: 500; font-family: var(--font-mono); color: var(--brand-green);"',
            'style="opacity: 0.9; font-size: 1.2rem; max-width: 32em; margin-top: 16px; font-weight: 500; font-family: var(--font-mono); color: var(--white);"'
        )
        # Form box background and border styling
        content = content.replace(
            'style="border: var(--border-width) solid var(--black); padding: 36px; background: var(--white); box-shadow: var(--shadow-brutal); width: 100%; position: relative;"',
            'style="border: var(--border-width) solid var(--border-color); padding: 36px; background: var(--bg-card); box-shadow: var(--shadow-brutal); width: 100%; position: relative;"'
        )
        content = content.replace(
            'style="width: 100%; padding: 12px; border: var(--border-width) solid var(--black); font-family: var(--font-mono);"',
            'style="width: 100%; padding: 12px; border: var(--border-width) solid var(--border-color); font-family: var(--font-mono);"'
        )
        content = content.replace(
            'style="width: 100%; padding: 12px; border: var(--border-width) solid var(--black); font-family: var(--font-body); resize: vertical;"',
            'style="width: 100%; padding: 12px; border: var(--border-width) solid var(--border-color); font-family: var(--font-body); resize: vertical;"'
        )
        content = content.replace(
            'style="width: 100%; padding: 12px; border: var(--border-width) solid var(--black); font-family: var(--font-mono);"',
            'style="width: 100%; padding: 12px; border: var(--border-width) solid var(--border-color); font-family: var(--font-mono);"'
        )
        content = content.replace(
            'style="border-bottom: 1px solid var(--black); padding-bottom: 12px; font-size: 0.82rem; font-weight: 700;"',
            'style="border-bottom: 1px solid var(--border-color); padding-bottom: 12px; font-size: 0.82rem; font-weight: 700;"'
        )
        # Split commissions layout bottom border
        content = content.replace(
            'style="padding: 72px 24px; border-bottom: var(--border-width) solid var(--black);"',
            'style="padding: 72px 24px; border-bottom: var(--border-width) solid var(--border-color);"'
        )
        # Guidelines boxes
        content = content.replace(
            'style="border: var(--border-width) solid var(--black); padding: 20px; background: #f9f9f9; box-shadow: var(--shadow-brutal);"',
            'style="border: var(--border-width) solid var(--border-color); padding: 20px; background: var(--bg-card-hover); box-shadow: var(--shadow-brutal);"'
        )
        # Success modal
        content = content.replace(
            'style="background: var(--white); border: var(--border-width) solid var(--black); padding: 36px; box-shadow: var(--shadow-brutal); text-align: center; max-width: 440px; margin: 20px;"',
            'style="background: var(--bg-card); border: var(--border-width) solid var(--border-color); padding: 36px; box-shadow: var(--shadow-brutal); text-align: center; max-width: 440px; margin: 20px;"'
        )

    # cart.html changes
    if fname == "cart.html":
        # Active badge
        content = content.replace(
            'style="color: var(--brand-green); background: var(--black); padding: 1px 6px;"',
            'style="color: var(--white); background: var(--black); padding: 1px 6px;"'
        )
        # Basket border-bottom
        content = content.replace(
            'style="font-size: 2rem; margin-bottom: 24px; border-bottom: var(--border-width) solid var(--black); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;"',
            'style="font-size: 2rem; margin-bottom: 24px; border-bottom: var(--border-width) solid var(--border-color); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;"'
        )
        # Cart layout bottom border
        content = content.replace(
            'style="padding: 72px 24px; border-bottom: var(--border-width) solid var(--black);"',
            'style="padding: 72px 24px; border-bottom: var(--border-width) solid var(--border-color);"'
        )
        # Summary border-top
        content = content.replace(
            'style="margin-top: 36px; padding-top: 24px; border-top: var(--border-width) solid var(--black); display: flex; flex-direction: column; gap: 12px;"',
            'style="margin-top: 36px; padding-top: 24px; border-top: var(--border-width) solid var(--border-color); display: flex; flex-direction: column; gap: 12px;"'
        )
        # Total row wrapper color
        content = content.replace(
            'style="width: 100%; display: flex; justify-content: space-between; font-weight: 700; border-top: 1px solid var(--border-color); padding-top: 4px; margin-top: 2px; background: var(--brand-green); border: var(--border-width) solid var(--border-color); padding: 4px;"',
            'style="width: 100%; display: flex; justify-content: space-between; font-weight: 700; border-top: 1px solid var(--border-color); padding-top: 4px; margin-top: 2px; background: var(--brand-green); border: var(--border-width) solid var(--border-color); padding: 4px; color: var(--white);"'
        )
        # Watermark
        content = content.replace(
            'style="font-size: 0.88rem; margin-top: 6px; border: 1px dashed var(--black); padding: 4px; display: inline-block; background: var(--brand-green); color: var(--black);"',
            'style="font-size: 0.88rem; margin-top: 6px; border: 1px dashed var(--border-color); padding: 4px; display: inline-block; background: var(--black); color: var(--white);"'
        )

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("HTML patch v2 completed successfully!")
