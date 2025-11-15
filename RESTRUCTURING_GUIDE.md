# Wage Tracker - Code Restructuring Guide 🏗️

## Current Structure Analysis

### Current Frontend Structure
```
frontend/src/
├── App.tsx
├── main.tsx
├── components/          # 20+ components (mixed purposes)
├── pages/              # 2 pages only
├── features/           # Only ai-assistant
├── contexts/
├── services/
├── store/              # Only authStore
├── types/
└── locales/
```

### Issues with Current Structure
1. **Too many components in root** - Hard to find specific components
2. **Mixed responsibilities** - UI components mixed with feature logic
3. **Limited feature modules** - Only AI assistant is modularized
4. **Single store file** - No separation of concerns
5. **Flat component structure** - No grouping by purpose

---

## Proposed New Structure

### 🎯 Feature-Based Architecture

```
frontend/src/
├── app/                          # App-level configuration
│   ├── App.tsx
│   ├── App.css
│   ├── router.tsx               # Centralized routing
│   └── providers.tsx            # All context providers
│
├── core/                         # Core functionality
│   ├── api/
│   │   ├── client.ts            # Axios instance
│   │   ├── interceptors.ts      # Request/response interceptors
│   │   └── endpoints.ts         # API endpoint constants
│   ├── config/
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   └── app-config.ts
│   ├── i18n/
│   │   ├── i18n.ts
│   │   └── locales/
│   │       ├── en/
│   │       └── vn/
│   └── types/
│       ├── api.types.ts
│       ├── common.types.ts
│       └── index.ts
│
├── features/                     # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthForm.tsx
│   │   │   ├── AuthForm.module.css
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── useRegister.ts
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts             # Public API
│   │
│   ├── jobs/
│   │   ├── components/
│   │   │   ├── JobList.tsx
│   │   │   ├── JobList.module.css
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobForm.tsx
│   │   │   └── JobFilters.tsx
│   │   ├── hooks/
│   │   │   ├── useJobs.ts
│   │   │   ├── useJobMutations.ts
│   │   │   └── useJobFilters.ts
│   │   ├── store/
│   │   │   └── jobStore.ts
│   │   ├── services/
│   │   │   └── job.service.ts
│   │   ├── types/
│   │   │   └── job.types.ts
│   │   └── index.ts
│   │
│   ├── work-entries/
│   │   ├── components/
│   │   │   ├── WorkEntryList.tsx
│   │   │   ├── WorkEntryList.module.css
│   │   │   ├── WorkEntryCard.tsx
│   │   │   ├── AddEntryModal.tsx
│   │   │   ├── AddWorkEntry.tsx
│   │   │   └── ClockWidget.tsx       # NEW
│   │   ├── hooks/
│   │   │   ├── useWorkEntries.ts
│   │   │   ├── useEntryMutations.ts
│   │   │   └── useClockInOut.ts      # NEW
│   │   ├── store/
│   │   │   └── workEntryStore.ts
│   │   ├── services/
│   │   │   └── work-entry.service.ts
│   │   ├── types/
│   │   │   └── work-entry.types.ts
│   │   └── index.ts
│   │
│   ├── analytics/                     # NEW FEATURE
│   │   ├── components/
│   │   │   ├── EarningsChart.tsx
│   │   │   ├── HoursChart.tsx
│   │   │   ├── JobDistribution.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalytics.ts
│   │   │   └── useChartData.ts
│   │   ├── services/
│   │   │   └── analytics.service.ts
│   │   ├── types/
│   │   │   └── analytics.types.ts
│   │   └── index.ts
│   │
│   ├── calendar/
│   │   ├── components/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── Calendar3DPanel.tsx
│   │   │   └── DatePicker.tsx
│   │   ├── hooks/
│   │   │   ├── useCalendar.ts
│   │   │   └── useDateRange.ts
│   │   └── index.ts
│   │
│   ├── ai-assistant/
│   │   ├── components/
│   │   │   ├── AssistantPanel.tsx
│   │   │   ├── AssistantPanel.module.css
│   │   │   ├── MessageList.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── hooks/
│   │   │   ├── useAssistant.ts
│   │   │   └── useFileUpload.ts
│   │   ├── store/
│   │   │   └── aiAssistantStore.ts
│   │   ├── services/
│   │   │   └── assistant.service.ts
│   │   ├── types/
│   │   │   └── assistant.types.ts
│   │   └── index.ts
│   │
│   └── settings/                      # NEW FEATURE
│       ├── components/
│       │   ├── SettingsPage.tsx
│       │   ├── ProfileSettings.tsx
│       │   ├── AppearanceSettings.tsx
│       │   └── NotificationSettings.tsx
│       ├── hooks/
│       │   └── useSettings.ts
│       ├── store/
│       │   └── settingsStore.ts
│       └── index.ts
│
├── shared/                           # Shared/reusable code
│   ├── components/
│   │   ├── ui/                      # Base UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.stories.tsx
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Dropdown/
│   │   │   ├── Tooltip/
│   │   │   └── index.ts
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   ├── feedback/                # Feedback components
│   │   │   ├── Toast.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── EmptyState.tsx
│   │   └── 3d/                      # 3D components
│   │       ├── ThreeScene.tsx
│   │       ├── Coin3D.tsx
│   │       ├── HeroCard3D.tsx
│   │       └── Model.tsx
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useClickOutside.ts
│   │   ├── useKeyPress.ts
│   │   └── index.ts
│   │
│   ├── utils/                        # Utility functions
│   │   ├── date.utils.ts
│   │   ├── format.utils.ts
│   │   ├── validation.utils.ts
│   │   ├── calculation.utils.ts
│   │   └── index.ts
│   │
│   └── constants/                    # Shared constants
│       ├── routes.ts
│       ├── messages.ts
│       └── index.ts
│
├── pages/                            # Page components
│   ├── DashboardPage/
│   │   ├── DashboardPage.tsx
│   │   ├── DashboardPage.module.css
│   │   └── index.ts
│   ├── AnalyticsPage/
│   ├── CalendarPage/
│   ├── JobsPage/
│   ├── SettingsPage/
│   └── index.ts
│
├── styles/                           # Global styles
│   ├── index.css
│   ├── variables.css
│   ├── reset.css
│   └── utilities.css
│
├── assets/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── main.tsx                          # Entry point
```

---

## Migration Strategy

### Phase 1: Setup New Structure (Day 1)
```bash
# Create new directories
mkdir -p src/{app,core,features,shared,pages}
mkdir -p src/core/{api,config,i18n,types}
mkdir -p src/shared/{components,hooks,utils,constants}
mkdir -p src/features/{auth,jobs,work-entries,analytics,calendar,settings}
```

### Phase 2: Move Core Files (Day 1-2)
1. Move API setup to `core/api/`
2. Move i18n to `core/i18n/`
3. Move types to appropriate locations
4. Update imports

### Phase 3: Refactor Features (Day 3-7)
1. **Auth Feature** (Day 3)
   - Move AuthForm, AuthForm2D
   - Create hooks (useAuth, useLogin, useRegister)
   - Move authStore
   - Update imports

2. **Jobs Feature** (Day 4)
   - Move JobList component
   - Create useJobs hook
   - Extract job service
   - Add types

3. **Work Entries Feature** (Day 5)
   - Move WorkEntryList, AddEntryModal, AddWorkEntry
   - Create hooks
   - Extract service
   - Add types

4. **Calendar Feature** (Day 6)
   - Move Calendar3DPanel
   - Create useCalendar hook
   - Extract logic

5. **AI Assistant** (Day 7)
   - Already modularized, just move to new location
   - Update imports

### Phase 4: Extract Shared Components (Day 8-9)
1. **UI Components**
   - Extract Input component
   - Extract Button (from various places)
   - Extract Modal
   - Create Card component

2. **Layout Components**
   - Extract common layouts
   - Create Header, Sidebar, Footer

3. **3D Components**
   - Move all Three.js related components
   - Organize under shared/components/3d/

### Phase 5: Update Pages (Day 10)
1. Create proper page components
2. Update routing
3. Test navigation

---

## Backend Restructuring

### Current Backend Structure
```
apps/backend/src/
├── app/
│   ├── app.module.ts
│   ├── common/
│   └── features/
│       ├── auth/
│       ├── user/
│       ├── wage/
│       ├── calendar/
│       └── assistant/
└── main.ts
```

### Proposed Improvements

#### 1. Add Shared Module
```typescript
// src/app/common/shared.module.ts
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    CacheModule,
  ],
  providers: [
    ValidationPipe,
    TransformInterceptor,
    ErrorFilter,
  ],
  exports: [...],
})
export class SharedModule {}
```

#### 2. Enhance Feature Modules

```
features/
├── auth/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── throttle.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── ...
│
├── jobs/                      # Separate from wage
│   ├── job.controller.ts
│   ├── job.service.ts
│   ├── job.module.ts
│   ├── entities/
│   │   └── job.entity.ts
│   ├── dto/
│   └── tests/
│
├── work-entries/              # Separate from wage
│   ├── work-entry.controller.ts
│   ├── work-entry.service.ts
│   ├── work-entry.module.ts
│   ├── entities/
│   ├── dto/
│   └── tests/
│
└── analytics/                 # NEW
    ├── analytics.controller.ts
    ├── analytics.service.ts
    ├── analytics.module.ts
    └── dto/
```

#### 3. Add Database Module
```typescript
// src/app/database/database.module.ts
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

#### 4. Add Logging Module
```typescript
// src/app/common/logger/logger.module.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level}]: ${message}`;
            }),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
```

---

## Component Examples

### Before: Monolithic Component
```tsx
// src/components/JobList.tsx (200+ lines)
export const JobList = () => {
  // Lots of logic
  // UI rendering
  // Multiple responsibilities
};
```

### After: Separated Concerns

```tsx
// src/features/jobs/hooks/useJobs.ts
export const useJobs = () => {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobService.getAll,
  });

  return { jobs, isLoading, error };
};

// src/features/jobs/hooks/useJobMutations.ts
export const useJobMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: jobService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: jobService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};

// src/features/jobs/components/JobList.tsx (50 lines)
export const JobList = () => {
  const { t } = useTranslation();
  const { jobs, isLoading } = useJobs();
  const { delete: deleteJob } = useJobMutations();

  if (isLoading) return <Skeleton count={3} />;
  if (!jobs?.length) return <EmptyState message={t('noJobsFound')} />;

  return (
    <div className={styles.container}>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} onDelete={deleteJob} />
      ))}
    </div>
  );
};

// src/features/jobs/components/JobCard.tsx
export const JobCard = ({ job, onDelete }) => {
  // Focused component for single job
};
```

---

## Shared Component Pattern

### Button Component Example

```tsx
// src/shared/components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isLoading && styles.loading,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {!isLoading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.label}>{children}</span>
      {!isLoading && rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};

// Usage:
import { Button } from '@/shared/components/ui';

<Button variant="primary" leftIcon={<PlusIcon />}>
  Add Job
</Button>
```

---

## Import Aliases

### Configure Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app/*": ["src/app/*"],
      "@/core/*": ["src/core/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/pages/*": ["src/pages/*"],
      "@/assets/*": ["src/assets/*"],
      "@/styles/*": ["src/styles/*"]
    }
  }
}
```

### Usage
```tsx
// Instead of:
import { AuthForm } from '../../../components/AuthForm';

// Use:
import { AuthForm } from '@/features/auth';
import { Button } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
```

---

## Testing Structure

```
src/features/jobs/
├── components/
│   ├── JobList.tsx
│   └── JobList.test.tsx        # Component test
├── hooks/
│   ├── useJobs.ts
│   └── useJobs.test.ts         # Hook test
└── services/
    ├── job.service.ts
    └── job.service.test.ts     # Service test
```

---

## Benefits of New Structure

### ✅ Maintainability
- Easy to find related code
- Clear separation of concerns
- Predictable file locations

### ✅ Scalability
- Easy to add new features
- No risk of "component soup"
- Clear ownership boundaries

### ✅ Reusability
- Shared components are obvious
- Feature modules are self-contained
- Easy to extract to packages

### ✅ Testability
- Tests live next to code
- Easy to mock dependencies
- Clear boundaries for unit tests

### ✅ Developer Experience
- Faster navigation
- Better autocomplete
- Easier onboarding

---

## Migration Checklist

- [ ] Create new directory structure
- [ ] Setup path aliases
- [ ] Move core files (api, config, i18n)
- [ ] Refactor auth feature
- [ ] Refactor jobs feature
- [ ] Refactor work-entries feature
- [ ] Extract shared UI components
- [ ] Extract shared hooks
- [ ] Extract shared utils
- [ ] Update all imports
- [ ] Update tests
- [ ] Update documentation
- [ ] Remove old structure
- [ ] Verify build works
- [ ] Verify tests pass

---

## Next Steps

1. **Review & Approve** - Get team buy-in
2. **Create Branch** - `feature/restructure-codebase`
3. **Implement Phase by Phase** - Don't do everything at once
4. **Test Continuously** - Ensure nothing breaks
5. **Update Documentation** - Keep README current
6. **Celebrate** 🎉 - Better codebase!

**Estimated Time:** 10-12 days (with testing)
**Risk Level:** Medium (requires careful testing)
**Benefit:** High (long-term maintainability)
