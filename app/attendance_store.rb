class AttendanceStore
  class << self      
    def add_subject(name,data,u)
      Rails.logger.info name;
      u.custom_fields[name] = data
      u.save_custom_fields(true)
      ::User.register_plugin_public_custom_field(name, 'attendance') # plugin.enabled? is checked at runtime
      ::User.register_custom_field_type(name, :json)
      ::User.register_plugin_staff_custom_field(name, 'attendance') # plugin.enabled? is checked at runtime
      ::User.register_plugin_editable_user_custom_field(name, 'attendance', staff_only: false) # plugin.enabled? is checked at runtime
    end
  end
end
  