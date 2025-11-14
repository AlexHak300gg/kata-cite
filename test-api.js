const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAPI() {
  try {
    console.log('Testing API...');
    
    // Test getting tasks
    console.log('\n1. Getting tasks...');
    const tasksResponse = await axios.get(`${API_URL}/tasks`);
    console.log('Tasks:', JSON.stringify(tasksResponse.data, null, 2));
    
    // Test creating a task
    console.log('\n2. Creating a task...');
    const newTask = {
      username: 'Test User',
      email: 'test@example.com',
      text: 'This is a test task'
    };
    const createResponse = await axios.post(`${API_URL}/tasks`, newTask);
    console.log('Created task:', JSON.stringify(createResponse.data, null, 2));
    
    // Test admin login
    console.log('\n3. Testing admin login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: '123'
    });
    console.log('Login successful:', JSON.stringify(loginResponse.data, null, 2));
    
    // Test updating a task (admin only)
    console.log('\n4. Updating task...');
    const token = loginResponse.data.token;
    const updateResponse = await axios.put(`${API_URL}/tasks/${createResponse.data.id}`, {
      text: 'Updated task text',
      completed: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Updated task:', JSON.stringify(updateResponse.data, null, 2));
    
    console.log('\n✅ All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();