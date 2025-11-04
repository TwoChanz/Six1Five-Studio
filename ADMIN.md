# Admin Dashboard Guide

## Access

Visit: `https://your-domain.com/admin`

**Default Password:** `admin615`

**Custom Password:** Set `VITE_ADMIN_PASSWORD` environment variable

⚠️ **Security Note:** This is a simple password-based protection. For production use with sensitive data, implement proper authentication (JWT, session-based auth, or OAuth).

---

## Features

### 📧 Contact Submissions Manager

**View all contact form submissions with:**
- Client contact information (name, email)
- Project details (type, location, budget, timeline)
- Services requested
- Reference files (if uploaded)
- Full project description

**Actions:**
- ✅ View all submissions chronologically
- 🗑️ Delete processed/spam submissions
- 📄 Click email addresses to compose replies
- 📎 Download reference files

---

### 📝 Blog Posts Manager

**Manage all blog content:**
- View published and draft posts
- See post metadata (slug, tags, excerpt)
- Creation dates and status

**Actions:**
- 👁️ Toggle publish/unpublish status
- 🗑️ Delete posts
- View all posts (including drafts)

**Coming Soon:**
- Edit existing posts inline
- Create new posts from UI
- Rich text editor integration
- Image upload for featured images

---

### 📁 Portfolio Items Manager

**Manage reality capture projects:**
- View all portfolio items
- See published/draft status
- Track featured items

**Actions:**
- ⭐ Toggle featured status (homepage display)
- 👁️ Toggle publish/unpublish status
- 🗑️ Delete portfolio items
- View item category and description

**Coming Soon:**
- Edit existing portfolio items
- Add new portfolio items via UI
- Upload 3D models and images
- Manage Sketchfab/Luma AI/Polycam embed URLs

---

## API Endpoints

The admin panel uses these protected endpoints:

### Contact Management
```
DELETE /api/admin/contact/:id
```

### Blog Management
```
GET    /api/admin/blog           # Get all posts (including unpublished)
PUT    /api/admin/blog/:id       # Update post (title, content, published status)
DELETE /api/admin/blog/:id       # Delete post
```

### Portfolio Management
```
PUT    /api/admin/portfolio/:id  # Update item (title, published, featured)
DELETE /api/admin/portfolio/:id  # Delete item
```

---

## Environment Variables

### Required
None - admin panel works out of the box

### Optional
```bash
# Custom admin password (recommended for production)
VITE_ADMIN_PASSWORD=your-secure-password-here
```

---

## Security Recommendations

1. **Change Default Password**
   - Set `VITE_ADMIN_PASSWORD` environment variable
   - Use a strong, unique password (20+ characters)

2. **Add IP Allowlist** (Production)
   - Restrict `/admin` route to specific IPs
   - Configure at reverse proxy level (nginx, Cloudflare)

3. **Implement Proper Auth** (Future Enhancement)
   - JWT tokens with expiration
   - Session-based authentication
   - OAuth integration (Google, GitHub)
   - Multi-factor authentication (2FA)

4. **HTTPS Only**
   - Ensure admin panel only accessible via HTTPS
   - Prevents password interception

5. **Rate Limiting**
   - Implement login attempt throttling
   - Use middleware like `express-rate-limit`

---

## Usage Tips

### Quick Actions

**Mark inquiry as processed:**
1. Reply to client via email link
2. Delete submission from admin panel

**Schedule blog post:**
1. Create post as draft (published: false)
2. When ready, toggle to published

**Feature a portfolio item:**
1. Click ⭐ star button
2. Item appears on homepage hero section

### Workflow

**New Contact Inquiry:**
1. Receive email notification (SendGrid)
2. Open admin panel → Contact Submissions
3. Review project details and reference files
4. Reply to client via email
5. Delete submission after processed

**Publish Blog Post:**
1. Create post via scripts or database
2. Admin panel → Blog Posts → Toggle publish
3. Post appears on public /blog page

**Manage Portfolio:**
1. Toggle featured for homepage display
2. Unpublish old/outdated projects
3. Delete test/demo items

---

## Troubleshooting

**Can't log in:**
- Check password (default: `admin615`)
- Verify `VITE_ADMIN_PASSWORD` if set
- Clear browser cache and cookies

**Changes not appearing:**
- Click refresh after bulk actions
- React Query caches data (30s default)
- Hard refresh browser (Ctrl+Shift+R)

**API errors:**
- Check browser console for details
- Verify server is running
- Check database connection

---

## Development

### Adding New Features

**Example: Add Edit Modal for Blog Posts**

```tsx
// In client/src/pages/admin.tsx - BlogManager component

const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

const updateMutation = useMutation({
  mutationFn: async ({ id, data }: { id: number; data: Partial<BlogPost> }) => {
    const response = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update");
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    setEditingPost(null);
    toast({ title: "Success", description: "Blog post updated" });
  },
});

// Add Edit button and Dialog modal to UI
```

### Testing Admin Features

```bash
# Start dev server
npm run dev

# Navigate to admin panel
open http://localhost:5000/admin

# Test CRUD operations
# - Create test contact submission via contact form
# - Toggle blog post published status
# - Feature/unfeature portfolio items
# - Delete test data
```

---

## Future Enhancements

- [ ] Rich text editor (TipTap, Quill, or Slate)
- [ ] Image upload with drag-and-drop
- [ ] Bulk actions (select multiple, delete all)
- [ ] Search and filter functionality
- [ ] Export data to CSV/JSON
- [ ] Analytics dashboard (submissions over time)
- [ ] Email template previews
- [ ] Activity log (audit trail)
- [ ] User roles (admin, editor, viewer)
- [ ] Dark/light theme toggle

---

## Support

For issues or feature requests, contact the development team or create an issue in the project repository.

