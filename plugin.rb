# name: attendance
# version: 0.1.0
load File.expand_path('../app/attendance_store.rb', __FILE__)
register_asset 'stylesheets/attendance_manager.css'
# register_asset 'stylesheets/mobile/attendance_manager_mobile.scss', :mobile
after_initialize do
    load File.expand_path('../app/controllers/attendance_controller.rb', __FILE__)
    register_user_custom_field_type('attendance-plugin', :json)
    whitelist_staff_user_custom_field('attendance-plugin')
    whitelist_public_user_custom_field('attendance-plugin')
    register_editable_user_custom_field('attendance-plugin',staff_only: false)

    Discourse::Application.routes.append do
        put '/attendance/insert' => 'attendance#insert'
        put '/attendance/update' => 'attendance#update'
        put '/attendance/update/subject' => 'attendance#updateSubject'
        delete '/attendance/delete' => 'attendance#delete'
        %w{users u}.each do |root_path|
            get "#{root_path}/:username/preferences/attendance" => "users#preferences", constraints: { username: RouteFormat.username }
        end
    end
end