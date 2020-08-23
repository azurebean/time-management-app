describe('User can do basic authentication', () => {
  it('can signup', () => {
    const name = Math.random().toString(36).substring(7)
    const email = `dummy_${name}@test.com`
    const password = 'password'
    cy.visit('/signup')
    cy.get('[data-cy=success_message]').should('not.exist')
    cy.focused().should('have.id', 'email')
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=full_name]').type(name)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=signup_button]').click()
    cy.wait(3000)
    cy.get('[data-cy=success_message]').should('exist')
  })
  it('can login', () => {
    const email = Cypress.config().adminEmail
    const password = Cypress.config().adminPassword
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.focused().should('have.id', 'email')
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=login_button]').click()
    cy.url().should('eq', Cypress.config().baseUrl)
  })
})

describe('User can CRUD their tasks', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8000/token/', {
      email: Cypress.config().testerEmail,
      password: Cypress.config().testerPassword,
    }).then((response) => {
      localStorage.setItem('token', JSON.stringify(response.body.access))
    })
  })
  it('can CRUD tasks', () => {
    const today = new Date().toISOString().slice(0, 10)
    const randomTasks = Cypress.config().randomTasks
    const randomNotes = Cypress.config().randomNotes
    const task = {
      name: randomTasks[Math.floor(Math.random() * randomTasks.length)],
      duration: Math.floor(Math.random() * 8),
      date: today,
      note: randomNotes[Math.floor(Math.random() * randomNotes.length)],
    }
    const updatedTaskName = 'UPDATED TASK NAME'
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl)
    // Add a new task for today
    cy.get('[data-cy=new_task_button').click()
    cy.get('[data-cy=date]').type(task.date)
    cy.get('[data-cy=name]').type(task.name)
    cy.get('[data-cy=duration]').type(task.duration)
    cy.get('[data-cy=note]').type(task.note)
    cy.get('[data-cy=submit_task]').click()

    // Filter tasks today
    cy.get('[id=from]').type(task.date)
    cy.get('[id=to]').type(task.date)
    cy.get('[data-cy=search_button]').click()
    cy.get('[data-cy=task_card]').should('have.length', 1)

    // Update tasks
    cy.get('[data-cy=edit_button]').first().click()
    cy.get('[data-cy=name]').find('input').clear().type(updatedTaskName)
    cy.get('[data-cy=submit_task]').click()
    cy.get('[data-cy=task_name]').first().should('have.text', updatedTaskName)

    // Delete task
    cy.get('[data-cy=delete_button]').first().click()
    cy.get('[data=task_card]').should('not.exist')
  })
})

describe('Manager can CRUD users', () => {
  beforeEach(() => {
    // Login as manager
    cy.request('POST', 'http://localhost:8000/token/', {
      email: Cypress.config().managerEmail,
      password: Cypress.config().managerPassword,
    }).then((response) => {
      localStorage.setItem('token', JSON.stringify(response.body.access))
    })
    // Create a new user
    cy.request('POST', 'http://localhost:8000/api/users/', {
      email: Cypress.config().dummyEmail,
      password: Cypress.config().dummyPassword,
      full_name: Cypress.config().dummyName,
    })
  })

  it('can CRUD users', () => {
    const updatedName = 'UPDATED NAME'
    const email = Cypress.config().dummyEmail

    cy.visit('/users/')
    cy.url().should('eq', Cypress.config().baseUrl + 'users/')

    // Check new user exists
    cy.get('[data-cy=user_email').contains(email).should('exist')

    // Update user
    cy.get('[data-cy=edit_user_button]').last().click()
    cy.get('[data-cy=full_name').find('input').clear().type(updatedName)
    cy.get('[data-cy=submit_button').click()
    cy.get('[data-cy=user_full_name').contains(updatedName).should('exist')

    // Delete user
    cy.get('[data-cy=delete_user_button]').last().click()
    cy.get('[data-cy=user_email').contains(email).should('not.exist')
  })
})
