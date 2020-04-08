class AttendanceController < ApplicationController
    before_action :ensure_logged_in
    def update

      name = params[:name]
      data = params[:data]
      type = params[:type]
      name = name
      field = current_user.custom_fields["attendance-plugin"]
      field[name][type] = data
      current_user.save_custom_fields(true)
      render_json_dump({ data: true })
    end

    def insert
      name = params[:name]
      attended = params[:attended]
      bunked = params[:bunked]
      mandatory = params[:mandatory]
      data = {
        "Attended"=> attended,
        "Bunked"=>bunked,
        "Mandatory"=> mandatory
      }
      field = current_user.custom_fields["attendance-plugin"]
      if field==nil
        current_user.custom_fields["attendance-plugin"] = {}
        current_user.save_custom_fields(true)
        p(current_user.custom_fields["attendance-plugin"])
        field = current_user.custom_fields["attendance-plugin"]
      end
      field[name] = data
      current_user.save_custom_fields(true)
      # AttendanceStore.add_subject(name, data,current_user)
      render_json_dump({ data: data })
    end

    def updateSubject
      beforeUpdateName = params[:previousName]
      name = params[:name]
      attended = params[:attended]
      bunked = params[:bunked]
      mandatory = params[:mandatory]
      field = current_user.custom_fields["attendance-plugin"]
      field = field.except! beforeUpdateName
      Rails.logger.info field
      data = {
        "Attended"=> attended,
        "Bunked"=>bunked,
        "Mandatory"=> mandatory
      }
      field[name] = data
      current_user.save_custom_fields(true)
      render_json_dump({ data: data })
    end
    
    def delete
      name = params[:name]
      field = current_user.custom_fields["attendance-plugin"]
      field = field.except! name
      current_user.save_custom_fields(true)
      render json: { notes: true }
    end
  end