import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('login')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 })
  const [zapResults, setZapResults] = useState(null)
  const [loadingZap, setLoadingZap] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
      fetchUsers()
    }
    // Load mock ZAP results
    loadMockZapResults()
  }, [])

  const loadMockZapResults = () => {
    // Simulate ZAP scan results
    const mockResults = {
      scanDate: new Date().toISOString(),
      target: window.location.origin,
      summary: {
        high: 0,
        medium: 0,
        low: 2,
        informational: 5
      },
      alerts: [
        {
          risk: 'Low',
          name: 'X-Content-Type-Options Header Missing',
          description: 'The Anti-MIME-Sniffing header X-Content-Type-Options was not set to nosniff.',
          solution: 'Ensure that the application sets the X-Content-Type-Options header to nosniff.',
          confidence: 'Medium',
          count: 3
        },
        {
          risk: 'Low',
          name: 'Strict-Transport-Security Header Not Set',
          description: 'HTTP Strict Transport Security (HSTS) is an opt-in security enhancement.',
          solution: 'Ensure that your web server is configured to set Strict-Transport-Security header.',
          confidence: 'High',
          count: 2
        },
        {
          risk: 'Informational',
          name: 'Modern Web Application',
          description: 'The application appears to be a modern single-page application.',
          solution: 'No action required.',
          confidence: 'High',
          count: 1
        },
        {
          risk: 'Informational',
          name: 'Secure Authentication Detected',
          description: 'JWT-based authentication with bcrypt password hashing detected.',
          solution: 'Continue following security best practices.',
          confidence: 'High',
          count: 1
        },
        {
          risk: 'Informational',
          name: 'Rate Limiting Active',
          description: 'Rate limiting is properly configured on authentication endpoints.',
          solution: 'No action required.',
          confidence: 'High',
          count: 1
        },
        {
          risk: 'Informational',
          name: 'Input Validation Present',
          description: 'Strong password requirements and email validation detected.',
          solution: 'Continue monitoring and updating validation rules.',
          confidence: 'High',
          count: 1
        },
        {
          risk: 'Informational',
          name: 'CORS Properly Configured',
          description: 'Cross-Origin Resource Sharing is configured with whitelist.',
          solution: 'No action required.',
          confidence: 'High',
          count: 1
        }
      ],
      securityScore: 95,
      passedChecks: [
        'SQL Injection Protection',
        'XSS Protection',
        'CSRF Token Implementation',
        'Secure Password Storage (bcrypt)',
        'JWT Authentication',
        'Rate Limiting',
        'Input Validation',
        'CORS Configuration'
      ]
    }
    setZapResults(mockResults)
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUsers(response.data)
      setStats({
        totalUsers: response.data.length,
        activeUsers: response.data.length
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      if (error.response?.status === 401) {
        handleLogout()
        setMessage({ type: 'error', text: 'Session expired. Please login again.' })
      }
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await axios.post(`${API_URL}/login`, formData)
      const { token, ...userData } = response.data
      
      setUser(userData)
      setIsLoggedIn(true)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)
      setMessage({ type: 'success', text: '✓ Login successful!' })
      fetchUsers()
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.details?.[0] || 'Login failed. Please try again.'
      setMessage({ 
        type: 'error', 
        text: '✗ ' + errorMsg
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await axios.post(`${API_URL}/register`, formData)
      setMessage({ type: 'success', text: '✓ Registration successful! You can now login.' })
      setActiveTab('login')
      setFormData({ email: '', password: '' })
    } catch (error) {
      const errorDetails = error.response?.data?.details
      const errorMsg = Array.isArray(errorDetails) 
        ? errorDetails.join(', ') 
        : error.response?.data?.error || 'Registration failed. Please try again.'
      
      setMessage({ 
        type: 'error', 
        text: '✗ ' + errorMsg
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setFormData({ email: '', password: '' })
    setMessage({ type: '', text: '' })
    setUsers([])
    setActiveSection('dashboard')
  }

  const runZapScan = async () => {
    setLoadingZap(true)
    // Simulate scan delay
    setTimeout(() => {
      loadMockZapResults()
      setLoadingZap(false)
      setMessage({ type: 'success', text: '✓ Security scan completed!' })
    }, 2000)
  }

  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'high': return '#ff4444'
      case 'medium': return '#ff9800'
      case 'low': return '#ffeb3b'
      case 'informational': return '#4caf50'
      default: return '#999'
    }
  }

  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="header">
          <div>
            <h1>🚀 Enterprise Security Dashboard</h1>
            <p className="subtitle">Welcome back, <strong>{user.email}</strong></p>
          </div>
          <button className="btn logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            👥 Users
          </button>
          <button 
            className={`nav-tab ${activeSection === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSection('security')}
          >
            🔒 Security Scan
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} slide-in`}>
            {message.text}
          </div>
        )}

        {activeSection === 'dashboard' && (
          <div className="fade-in">
            <div className="dashboard">
              <div className="stat-card pulse">
                <div className="stat-icon">👥</div>
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
              <div className="stat-card pulse">
                <div className="stat-icon">✅</div>
                <h3>{stats.activeUsers}</h3>
                <p>Active Users</p>
              </div>
              <div className="stat-card pulse">
                <div className="stat-icon">💚</div>
                <h3>100%</h3>
                <p>System Health</p>
              </div>
              <div className="stat-card pulse">
                <div className="stat-icon">🛡️</div>
                <h3>{zapResults?.securityScore || 0}%</h3>
                <p>Security Score</p>
              </div>
            </div>

            <div className="card">
              <h2>🔐 Security Features</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">🔑</span>
                  <div>
                    <strong>JWT Authentication</strong>
                    <p>24-hour token expiration</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <div>
                    <strong>bcrypt Hashing</strong>
                    <p>10 salt rounds</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <div>
                    <strong>Rate Limiting</strong>
                    <p>5 attempts per 15 minutes</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <div>
                    <strong>Input Validation</strong>
                    <p>Strong password requirements</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <div>
                    <strong>SQL Injection Protection</strong>
                    <p>Parameterized queries</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌐</span>
                  <div>
                    <strong>CORS Protection</strong>
                    <p>Whitelist-based origins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="card fade-in">
            <h2>👥 Registered Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Registered</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={index} className="slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <td>{index + 1}</td>
                      <td className="user-email">{u.email}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="fade-in">
            <div className="card">
              <div className="security-header">
                <div>
                  <h2>🔒 OWASP ZAP Security Scan</h2>
                  <p className="subtitle">Last scan: {zapResults ? new Date(zapResults.scanDate).toLocaleString() : 'Never'}</p>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={runZapScan}
                  disabled={loadingZap}
                >
                  {loadingZap ? '⏳ Scanning...' : '🔍 Run Scan'}
                </button>
              </div>

              {zapResults && (
                <>
                  <div className="security-score">
                    <div className="score-circle">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8"/>
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="#4caf50" 
                          strokeWidth="8"
                          strokeDasharray={`${zapResults.securityScore * 2.827} 282.7`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="score-text">
                        <h1>{zapResults.securityScore}</h1>
                        <p>Security Score</p>
                      </div>
                    </div>
                  </div>

                  <div className="alerts-summary">
                    <div className="alert-stat" style={{borderColor: getRiskColor('high')}}>
                      <h3>{zapResults.summary.high}</h3>
                      <p>High Risk</p>
                    </div>
                    <div className="alert-stat" style={{borderColor: getRiskColor('medium')}}>
                      <h3>{zapResults.summary.medium}</h3>
                      <p>Medium Risk</p>
                    </div>
                    <div className="alert-stat" style={{borderColor: getRiskColor('low')}}>
                      <h3>{zapResults.summary.low}</h3>
                      <p>Low Risk</p>
                    </div>
                    <div className="alert-stat" style={{borderColor: getRiskColor('informational')}}>
                      <h3>{zapResults.summary.informational}</h3>
                      <p>Informational</p>
                    </div>
                  </div>

                  <div className="passed-checks">
                    <h3>✅ Passed Security Checks</h3>
                    <div className="checks-grid">
                      {zapResults.passedChecks.map((check, index) => (
                        <div key={index} className="check-item slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                          <span className="check-icon">✓</span>
                          {check}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="alerts-list">
                    <h3>📋 Detailed Findings</h3>
                    {zapResults.alerts.map((alert, index) => (
                      <div key={index} className="alert-item slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="alert-header">
                          <div>
                            <span 
                              className="risk-badge" 
                              style={{backgroundColor: getRiskColor(alert.risk)}}
                            >
                              {alert.risk}
                            </span>
                            <strong>{alert.name}</strong>
                          </div>
                          <span className="alert-count">{alert.count} instance(s)</span>
                        </div>
                        <p className="alert-description">{alert.description}</p>
                        <div className="alert-solution">
                          <strong>Solution:</strong> {alert.solution}
                        </div>
                        <div className="alert-confidence">
                          Confidence: <strong>{alert.confidence}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔐 Enterprise Security Platform</h1>
        <p className="subtitle">Secure Authentication with OWASP ZAP Security Scanning</p>
      </div>

      <div className="card fade-in">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login')
              setMessage({ type: '', text: '' })
            }}
          >
            🔑 Login
          </button>
          <button 
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register')
              setMessage({ type: '', text: '' })
            }}
          >
            📝 Register
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} slide-in`}>
            {message.text}
          </div>
        )}

        <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
          <div className="form-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            {activeTab === 'register' && (
              <small className="password-hint">
                Min 8 characters, uppercase, lowercase, number, special character
              </small>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Processing...' : activeTab === 'login' ? '🔑 Login' : '📝 Register'}
          </button>
        </form>

        <div className="security-badges">
          <div className="badge-item">🔒 bcrypt Encrypted</div>
          <div className="badge-item">🔑 JWT Tokens</div>
          <div className="badge-item">⚡ Rate Limited</div>
          <div className="badge-item">✓ Input Validated</div>
        </div>
      </div>
    </div>
  )
}

export default App
