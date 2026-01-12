-- @param {String} $1:userId
-- @param {String} $2:parentId
-- @param {Int} $3:limit
-- @param {Int} $4:offset
-- @param {String} $5:sortBy
-- @param {String} $6:order

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
    AND f.parent_id = $2

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
    AND fi.folder_id = $2
) docs
ORDER BY
  CASE WHEN $5 = 'name'    AND $6 = 'ascending'  THEN name      END ASC,
  CASE WHEN $5 = 'name'    AND $6 = 'descending' THEN name      END DESC,

  CASE WHEN $5 = 'size'    AND $6 = 'ascending'  THEN size      END ASC,
  CASE WHEN $5 = 'size'    AND $6 = 'descending' THEN size      END DESC,

  CASE WHEN $5 = 'author'  AND $6 = 'ascending'  THEN author    END ASC,
  CASE WHEN $5 = 'author'  AND $6 = 'descending' THEN author    END DESC,

  CASE WHEN $5 = 'created' AND $6 = 'ascending'  THEN "createdAt" END ASC,
  CASE WHEN $5 = 'created' AND $6 = 'descending' THEN "createdAt" END DESC,

  "createdAt" DESC
LIMIT $3 OFFSET $4;
