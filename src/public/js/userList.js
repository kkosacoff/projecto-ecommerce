document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.role-change').forEach((select) => {
    select.addEventListener('change', function () {
      const userId = this.getAttribute('data-id')
      const newRole = this.value

      fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            alert('Role updated successfully!')
            location.reload() // reloads the page to reflect changes
          }
        })
    })
  })

  document.querySelectorAll('.delete-user').forEach((button) => {
    button.addEventListener('click', function () {
      const userId = this.getAttribute('data-id')

      fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            alert('User deleted successfully!')
            location.reload() // reloads the page to reflect changes
          }
        })
    })
  })
})
