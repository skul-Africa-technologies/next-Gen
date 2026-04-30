# Student Dashboard

A modern, lightweight student dashboard built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Modern Dark Theme** - Fashion/lifestyle inspired design with smooth gradients
- 🎬 **Smooth Animations** - Framer Motion powered page transitions and hover effects
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🔒 **Authentication** - Protected routes with localStorage token management
- 📊 **Dashboard Overview** - Welcome section with summary statistics
- 👤 **Profile Management** - View and edit student information
- 📅 **Events Tracking** - View upcoming and applied events
- ⚙️ **Settings** - Update profile with live validation and feedback

## Dashboard Pages

### 1. Dashboard Home (`/dashboard`)
- Welcome message with student name
- Summary cards:
  - Total Events
  - Upcoming Events  
  - Applied Events
- Recent & upcoming events preview

### 2. Profile Page (`/dashboard/profile`)
- Clean profile card with avatar (initials-based)
- Display: Full Name, Email, School, Level
- Edit mode for updating profile
- Form validation and error handling

### 3. Events Page (`/dashboard/events`)
- Card-based layout for applied events
- Card-based layout for upcoming events
- Each card shows: Title, Date, Location, Status
- Subtle hover animations and image effects

### 4. Settings Page (`/dashboard/settings`)
- Editable form for Name and School
- Real-time change detection
- Success/error toast notifications
- Reset and save functionality

## Authentication Flow

1. **After Login/Signup**:
   - `accessToken` stored in `localStorage`
   - `user` object stored in `localStorage`

2. **Route Protection**:
   - Dashboard routes check for `accessToken`
   - Redirects to `/login` if no token

3. **API Requests**:
   - All requests include: `Authorization: Bearer <token>`

## Design Style

- **Theme**: Dark (consistent with signup page)
- **Primary Color**: Orange (`#FF6B00`) - gradient accents
- **Cards**: Rounded (`rounded-xl`) with soft shadows
- **Transitions**: `ease-in-out` smooth animations
- **Typography**: Space Grotesk (headings), Poppins (body)

## Components

### Layout
- `app/dashboard/layout.tsx` - Dashboard shell with sidebar navigation
  - Mobile-responsive sidebar (hamburger menu on mobile)
  - Logout functionality
  - Active route highlighting

### Pages
- `app/dashboard/page.tsx` - Dashboard home
- `app/dashboard/profile/page.tsx` - Profile view/edit
- `app/dashboard/events/page.tsx` - Events list
- `app/dashboard/settings/page.tsx` - Settings form

### Utilities
- `lib/student-api.ts` - Student API hooks and methods
- `components/ui/loading.tsx` - Loading components (spinner, skeletons)
- `components/ui/toast-provider.tsx` - Toast notification provider

## Animation Details

### Framer Motion Usage

1. **Page Transitions**
   - Fade + slide up on mount
   - Staggered children animations
   - Delays for sequential reveals

2. **Hover Effects**
   - Card scale on hover (1.02x)
   - Shadow glow transitions
   - Smooth 0.2s transitions

3. **Mobile Sidebar**
   - Slide-in animation
   - Backdrop fade
   - Overlay click to dismiss

## API Integration

### Student APIs
- `GET /users/{id}` - Fetch user profile
- `PATCH /users/{id}` - Update profile
- `GET /events` - Get all events
- `GET /events/upcoming` - Get upcoming events
- `POST /events/{id}/apply` - Apply for event

### Error Handling
- Network error detection
- API response validation
- User-friendly error messages
- Toast notifications for feedback

## UX Details

- ⏳ **Loading States**: Skeletons while fetching data
- ❌ **Error Handling**: Inline messages + toast notifications
- 🔘 **Button States**: Disabled states during loading
- 🔄 **Page Transitions**: Fade/slide animations
- ✅ **Form Validation**: Real-time change detection

## Folder Structure

```
src/app/dashboard/
 layout.tsx              # Dashboard layout (sidebar)
 page.tsx                # Dashboard home
 profile/
    page.tsx           # Profile page
 events/
    page.tsx           # Events page
 settings/
     page.tsx           # Settings page
```

## Responsive Breakpoints

- **Mobile** (`< 768px`): 
  - Hamburger menu
  - Single column layout
  - Full-width cards

- **Tablet** (`768px - 1024px`):
  - Sidebar hidden on mobile
  - 2-column grids

- **Desktop** (`> 1024px`):
  - Persistent sidebar
  - 3-column stat cards
  - Full feature set

## Performance

- Minimal JavaScript bundles
- Client-side only components (`"use client"`)
- Optimized re-renders with proper state management
- Lazy loading for images

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
