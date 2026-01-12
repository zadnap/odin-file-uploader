-- @param {String} $1:userId
-- @param {Int} $2:limit
-- @param {Int} $3:offset
-- @param {String} $4:sortBy
-- @param {String} $5:order

SELECT * FROM (
  SELECT
    f.id,
    f.name,
    'folder' AS type,
    f.created_at AS "createdAt",
    NULL::int AS size,
    u.username AS author
  FROM folders f
  JOIN users u ON u.id = f.user_id
  WHERE f.user_id = $1
    AND f.parent_id IS NULL

  UNION ALL

  SELECT
    fi.id,
    fi.name,
    fi.mime_type AS type,
    fi.created_at AS "createdAt",
    fi.size,
    u.username AS author
  FROM files fi
  JOIN users u ON u.id = fi.user_id
  WHERE fi.user_id = $1
    AND fi.folder_id IS NULL
) docs
ORDER BY
  CASE WHEN $4 = 'name'    AND $5 = 'ascending'  THEN name      END ASC,
  CASE WHEN $4 = 'name'    AND $5 = 'descending' THEN name      END DESC,

  CASE WHEN $4 = 'size'    AND $5 = 'ascending'  THEN size      END ASC,
  CASE WHEN $4 = 'size'    AND $5 = 'descending' THEN size      END DESC,

  CASE WHEN $4 = 'author'  AND $5 = 'ascending'  THEN author    END ASC,
  CASE WHEN $4 = 'author'  AND $5 = 'descending' THEN author    END DESC,

  CASE WHEN $4 = 'created' AND $5 = 'ascending'  THEN "createdAt" END ASC,
  CASE WHEN $4 = 'created' AND $5 = 'descending' THEN "createdAt" END DESC,

  "createdAt" DESC
LIMIT $2 OFFSET $3;
