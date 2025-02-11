import { MailjetClient } from './providers/mailjet/client';
import type { EmailOptions } from './types/email';
import { config } from 'dotenv';

// Load environment variables
config();

async function testMailjet() {
  try {
    console.log('\n🚀 Starting Mailjet API test...\n');
    
    // Log environment variables (without sensitive values)
    console.log('Environment check:');
    
    // Get environment variables
    const apiKey = process.env.VITE_MAILJET_API_KEY;
    const apiSecret = process.env.VITE_MAILJET_API_SECRET;
    
    console.log('VITE_MAILJET_API_KEY:', apiKey ? '✅ Present' : '❌ Missing');
    console.log('VITE_MAILJET_API_SECRET:', apiSecret ? '✅ Present' : '❌ Missing');
    console.log();
    
    if (!apiKey || !apiSecret) {
      throw new Error('Missing required environment variables');
    }
    
    const client = MailjetClient.getInstance();
    
    console.log('📧 Sending test email...\n');
    
    const emailOptions: EmailOptions = {
      to: [{ email: 'jbbejot@gmail.com', name: 'Jean-Baptiste' }],
      subject: 'Test Mailjet API Configuration',
      html: `
        <h2>Test de configuration Mailjet API</h2>
        <p>Si vous recevez cet email, la configuration de l'API Mailjet fonctionne correctement.</p>
        <p>Date et heure du test: ${new Date().toLocaleString('fr-FR')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Cet email a été envoyé depuis l'environnement de test CollabSpace
        </p>
      `,
      text: 'Test de configuration Mailjet API. Si vous recevez cet email, la configuration fonctionne correctement.'
    };
    
    await client.sendEmail(emailOptions);
    
    console.log('✅ Test email sent successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to send test email:\n');
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if ('cause' in error && error.cause) {
        console.error('\nError cause:', error.cause);
      }
      
      console.error('\nStack trace:');
      console.error(error.stack);
    } else {
      console.error('Unknown error:', error);
    }
    
    process.exit(1);
  }
}

// Main execution
const main = async () => {
  console.log('🔍 Starting Mailjet configuration test...');
  try {
    await testMailjet();
  } catch (error) {
    console.error('\n💥 Unhandled error:', error);
    process.exit(1);
  }
};

// Run the main function
main();