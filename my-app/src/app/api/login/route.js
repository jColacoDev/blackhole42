import axios from 'axios';

export async function GET(req) {
  try {
    const response = await axios.get('http://localhost:5000/api/projects');
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
    const { email, password } = await req.json();
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Login failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  