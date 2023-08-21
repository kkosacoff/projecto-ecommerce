const roles = {
  view_product: ['User', 'Premium'],
  view_admin_product: ['Premium', 'Admin'],
  create_product: ['Premium', 'Admin'],
  delete_product: ['Admin', 'Premium'],
  update_product: ['Admin'],
  view_cart: ['Admin', 'Premium', 'User'],
  add_to_cart: ['User', 'Premium'],
  clear_cart: ['User', 'Premium'],
  view_ticket: ['User', 'Premium'],
  upload_docs: ['User', 'Premium'],
  view_users: ['Admin'],
  delete_users: ['Admin'],
}

export default function checkPermission(action) {
  return (req, res, next) => {
    const user = req.session.user

    if (!user) {
      return res.render('unauthorized')
    }

    if (roles[action].includes(user.role)) {
      next()
    } else {
      return res.render('unauthorized')
    }
  }
}
