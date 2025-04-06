import { test, expect } from '@playwright/test';

test.describe('Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('MoodSelector Component', async ({ page }) => {
    await page.click('text=Products');
    
    // Test mood selection
    const moods = ['Happy', 'Excited', 'Relaxed', 'Focused'];
    for (const mood of moods) {
      await page.click(`button:has-text("${mood}")`);
      await expect(page.locator(`button:has-text("${mood}")`))
        .toHaveClass(/selected/);
    }
    
    // Test mood persistence
    await page.reload();
    await expect(page.locator('button:has-text("Happy")'))
      .toHaveClass(/selected/);
  });

  test('ProductCard Component', async ({ page }) => {
    await page.click('text=Products');
    
    // Test product card rendering
    const productCard = await page.locator('.product-card').first();
    await expect(productCard.locator('.product-name')).toBeVisible();
    await expect(productCard.locator('.product-price')).toBeVisible();
    await expect(productCard.locator('.product-features')).toBeVisible();
    
    // Test product story expansion
    await productCard.click();
    await expect(page.locator('.product-story')).toBeVisible();
    await expect(page.locator('.psychographic-match')).toBeVisible();
  });

  test('ChatAssistant Component', async ({ page }) => {
    await page.click('button:has-text("Chat")');
    
    // Test chat input
    const testMessage = 'What are your best recommendations?';
    await page.fill('textarea[placeholder="Type your message..."]', testMessage);
    await page.click('button:has-text("Send")');
    
    // Verify message sent
    await expect(page.locator('.chat-message:last-child'))
      .toContainText(testMessage);
    
    // Verify AI response
    await expect(page.locator('.chat-message:last-child'))
      .toContainText(/recommendation|suggestion/i);
    
    // Test chat history
    const chatHistory = await page.locator('.chat-message');
    await expect(chatHistory).toHaveCountGreaterThan(1);
  });

  test('VoiceSearch Component', async ({ page }) => {
    await page.click('text=Products');
    
    // Test voice search button
    await page.click('button:has-text("Voice Search")');
    await expect(page.locator('.voice-search-active')).toBeVisible();
    
    // Test manual search fallback
    await page.fill('input[placeholder="Search products..."]', 'test search');
    await page.press('input[placeholder="Search products..."]', 'Enter');
    
    // Verify search results
    await expect(page.locator('.product-card')).toHaveCountGreaterThan(0);
  });

  test('PersonaDisplay Component', async ({ page }) => {
    // Test persona card rendering
    const personaCard = await page.locator('.persona-card');
    await expect(personaCard).toBeVisible();
    
    // Verify persona sections
    await expect(personaCard.locator('.psychographic-traits')).toBeVisible();
    await expect(personaCard.locator('.behavioral-patterns')).toBeVisible();
    await expect(personaCard.locator('.interests')).toBeVisible();
    
    // Test persona update
    await page.click('text=Update Preferences');
    await page.fill('input[name="interests"]', 'gaming, technology');
    await page.click('button:has-text("Save")');
    
    // Verify updated persona
    await expect(personaCard.locator('.interests'))
      .toContainText('gaming');
  });

  test('RecommendationList Component', async ({ page }) => {
    await page.click('text=Products');
    
    // Test recommendation list
    const recommendations = await page.locator('.recommendation-list');
    await expect(recommendations).toBeVisible();
    
    // Verify recommendation items
    const items = await recommendations.locator('.recommendation-item');
    await expect(items).toHaveCountGreaterThan(0);
    
    // Test recommendation explanation
    await items.first().click();
    await expect(page.locator('.recommendation-explanation')).toBeVisible();
    
    // Test recommendation feedback
    await page.click('button:has-text("Helpful")');
    await expect(page.locator('.feedback-success')).toBeVisible();
  });
}); 