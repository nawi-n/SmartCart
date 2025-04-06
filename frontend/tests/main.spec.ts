import { test, expect } from '@playwright/test';

test.describe('SmartCart User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Complete Customer Journey', async ({ page }) => {
    // Login/Register
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button:has-text("Continue")');
    
    // Wait for persona generation
    await page.waitForSelector('.persona-card', { timeout: 10000 });
    
    // Verify persona display
    const personaCard = await page.locator('.persona-card');
    await expect(personaCard).toBeVisible();
    await expect(personaCard).toContainText('Psychographic Traits');
    
    // Browse products
    await page.click('text=Products');
    await page.waitForSelector('.product-grid');
    
    // Test mood selection
    await page.click('button:has-text("Happy")');
    await page.waitForSelector('.product-card', { timeout: 5000 });
    
    // Verify mood-based filtering
    const productCards = await page.locator('.product-card');
    await expect(productCards).toHaveCountGreaterThan(0);
    
    // Test voice search
    await page.click('button:has-text("Voice Search")');
    // Note: Actual voice input simulation would require additional setup
    await page.fill('input[placeholder="Search products..."]', 'gaming laptop');
    await page.press('input[placeholder="Search products..."]', 'Enter');
    
    // Verify search results
    await page.waitForSelector('.product-card');
    const searchResults = await page.locator('.product-card');
    await expect(searchResults).toHaveCountGreaterThan(0);
    
    // Test chat interaction
    await page.click('button:has-text("Chat")');
    await page.fill('textarea[placeholder="Type your message..."]', 'What gaming laptops do you recommend?');
    await page.click('button:has-text("Send")');
    
    // Verify chat response
    await page.waitForSelector('.chat-message');
    const chatMessages = await page.locator('.chat-message');
    await expect(chatMessages).toHaveCountGreaterThan(0);
    
    // Test product storytelling
    await page.click('.product-card:first-child');
    await page.waitForSelector('.product-story');
    const story = await page.locator('.product-story');
    await expect(story).toBeVisible();
    await expect(story).toContainText(/story|narrative/i);
  });

  test('Error Handling', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/*', route => route.abort());
    await page.click('text=Products');
    await expect(page.locator('.error-message')).toBeVisible();
    
    // Test empty results
    await page.route('**/api/products*', route => route.fulfill({
      status: 200,
      body: JSON.stringify([])
    }));
    await page.reload();
    await expect(page.locator('.no-results')).toBeVisible();
    
    // Test invalid input
    await page.click('button:has-text("Chat")');
    await page.fill('textarea[placeholder="Type your message..."]', '');
    await page.click('button:has-text("Send")');
    await expect(page.locator('.input-error')).toBeVisible();
  });

  test('Responsive Design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.mobile-menu')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.tablet-layout')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.desktop-layout')).toBeVisible();
  });

  test('Performance Metrics', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Measure API response time
    const [response] = await Promise.all([
      page.waitForResponse('**/api/products'),
      page.click('text=Products')
    ]);
    expect(response.timing().responseEnd - response.timing().requestStart)
      .toBeLessThan(1000); // API should respond within 1 second
  });
}); 