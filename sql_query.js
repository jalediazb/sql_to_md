exports.query = `
  SELECT
    posts.ID,
    posts.post_date,
    posts.post_modified,
    posts.post_type,
    template.meta_value AS template,
    posts.post_parent,
    posts.post_name AS slug,
    parent.post_name AS parent_slug,
    posts.post_title,
    seo_title.meta_value AS seo_title,
    seo_description.meta_value AS seo_description,
    featured_image_ID.meta_value AS featured_image_id,
    img.guid AS thumbnail_url,
    GROUP_CONCAT(DISTINCT tc.name) AS categories,
    GROUP_CONCAT(DISTINCT tt.name) AS tags,
    posts.post_excerpt,
    posts.post_content
  FROM
    wp_posts AS posts
  LEFT JOIN wp_postmeta AS template
    ON template.post_id = posts.ID
    AND template.meta_key = '_wp_page_template'
  LEFT JOIN wp_postmeta AS featured_image_ID
    ON featured_image_ID.post_id = posts.ID
    AND featured_image_ID.meta_key = '_thumbnail_id'
  LEFT JOIN wp_posts AS parent
    ON posts.post_parent = parent.ID
  LEFT JOIN wp_posts AS img
    ON featured_image_ID.meta_value = img.ID
  LEFT JOIN wp_term_relationships AS tr
    ON posts.ID = tr.object_id
  LEFT JOIN wp_term_taxonomy AS ttax
    ON tr.term_taxonomy_id = ttax.term_taxonomy_id
  LEFT JOIN wp_terms AS tc
    ON ttax.term_id = tc.term_id
    AND ttax.taxonomy = 'category'
  LEFT JOIN wp_terms AS tt
    ON ttax.term_id = tt.term_id
    AND ttax.taxonomy = 'post_tag'
  LEFT JOIN wp_postmeta AS seo_title
    ON seo_title.post_id = posts.ID
    AND seo_title.meta_key = '_genesis_title'
  LEFT JOIN wp_postmeta AS seo_description
    ON seo_description.post_id = posts.ID
    AND seo_description.meta_key = '_genesis_description'
  WHERE
    posts.post_status = 'publish'
    AND posts.post_type IN ('post', 'page')
  GROUP BY
    posts.ID, posts.post_title;
  `

