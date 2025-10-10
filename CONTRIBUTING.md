# Contributing to Streakify

Thank you for your interest in contributing to Streakify! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/streakify.git
   cd streakify
   ```
3. **Follow the setup guide** in [docs/SETUP.md](docs/SETUP.md)
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting (Prettier/ESLint)
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types
- Follow the existing component structure

### API Guidelines
- Follow RESTful conventions
- Use proper HTTP status codes
- Validate all inputs with Zod schemas
- Handle errors gracefully

## 🧪 Testing

Before submitting a PR:
1. Test your changes locally
2. Ensure all existing functionality works
3. Test edge cases and error scenarios
4. Verify responsive design on different screen sizes

## 📝 Commit Guidelines

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add goal completion celebration animation
fix: resolve workspace invite code expiration bug
docs: update API documentation for goals endpoint
```

## 🔄 Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** on different devices/browsers
3. **Create a clear PR description** explaining:
   - What changes were made
   - Why they were necessary
   - How to test the changes
4. **Link related issues** if applicable
5. **Request review** from maintainers

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested edge cases

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

When reporting bugs, include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Screenshots/videos** if applicable
- **Environment details** (browser, OS, etc.)
- **Console errors** if any

## 💡 Feature Requests

For new features:
- **Describe the problem** you're trying to solve
- **Explain your proposed solution**
- **Consider alternative approaches**
- **Discuss potential impact** on existing users

## 🏗️ Project Structure

```
collab-tracker/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth pages
│   ├── api/            # API routes
│   └── [pages]/        # App pages
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── [features]/    # Feature-specific components
├── lib/               # Utilities & config
└── public/            # Static assets
```

## 🎨 Design Guidelines

- Follow existing design patterns
- Use Tailwind CSS classes consistently
- Maintain responsive design principles
- Consider accessibility (WCAG guidelines)
- Test with different themes (light/dark)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## ❓ Questions?

- Check existing [GitHub Issues](https://github.com/your-repo/issues)
- Join our community discussions
- Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Streakify! 🎯