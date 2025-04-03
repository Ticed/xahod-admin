import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('loads the homepage', async ({ page }) => {
  test.setTimeout(60000); // Extended timeout
  
  console.log('Starting test...');
  
  try {
    // Log all console messages
    const allMessages: {type: string, text: string}[] = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      allMessages.push({type, text});
      console.log(`Browser console [${type}]: ${text}`);
      
      if (type === 'error') {
        console.log(`CONSOLE ERROR: ${text}`);
      }
    });
    
    // Navigate to the page with the correct base path
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:5173/xahod-admin/');
    
    // Wait for potential initial loads
    console.log('Waiting for network idle...');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for debugging
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'test-results/homepage.png' });
    
    // Check the HTML content
    const html = await page.content();
    console.log('Page HTML length:', html.length);
    
    // Save the HTML content to a file for inspection
    fs.writeFileSync('test-results/page-content.html', html);
    
    // Log the title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if we have any main content
    const appElement = await page.$('#app');
    console.log('App element found:', !!appElement);
    
    // Check for any visible elements inside #app
    const appContents = await page.$$('#app *');
    console.log('Number of elements inside #app:', appContents.length);
    
    // If there are no visible contents, add debugging info
    if (appContents.length === 0) {
      console.log('No visible elements in #app - app may not be mounting correctly');
      
      // Check for script load errors
      console.log('Checking network requests...');
      await page.evaluate(() => {
        const performance = window.performance;
        const resources = performance.getEntriesByType('resource');
        
        return resources.filter(resource => {
          return resource.name.includes('main.ts') || 
                 resource.name.includes('.js') || 
                 resource.name.includes('.css');
        }).map(r => ({ name: r.name, duration: r.duration }));
      }).then(resources => console.log('Resources:', JSON.stringify(resources)));
    }
    
    // Wait for any Vue content to render
    await page.waitForTimeout(5000);
    
    // Take another screenshot after waiting
    await page.screenshot({ path: 'test-results/homepage-after-wait.png' });
    
    // Save all console messages to a file
    if (allMessages.length > 0) {
      fs.writeFileSync('test-results/console-messages.txt', 
        allMessages.map(m => `[${m.type}] ${m.text}`).join('\n'));
    }
    
    // Assert that the page is not empty
    expect(await page.locator('body').textContent()).not.toBe('');
  } catch (error) {
    console.error('Test error:', error);
    await page.screenshot({ path: 'test-results/error.png' });
    throw error;
  }
});