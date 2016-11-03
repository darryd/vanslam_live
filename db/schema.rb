# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161103011958) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "competitions", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.integer  "event_number"
    t.boolean  "is_closed"
    t.integer  "num_judges"
    t.boolean  "do_not_include_min_and_max_scores"
    t.integer  "organization_id"
    t.boolean  "is_template"
  end

  create_table "events", force: :cascade do |t|
    t.integer  "event_number"
    t.integer  "competition_id"
    t.integer  "scorekeeper_id"
    t.string   "event"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "hosts", force: :cascade do |t|
    t.integer  "organization_id"
    t.string   "host"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "judges", force: :cascade do |t|
    t.integer  "performance_id"
    t.string   "judge_name"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.float    "value"
  end

  create_table "logged_ins", force: :cascade do |t|
    t.integer  "scorekeeper_id"
    t.string   "session_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.string   "key"
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "performances", force: :cascade do |t|
    t.integer  "poet_id"
    t.integer  "round_id"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.integer  "minutes"
    t.integer  "seconds"
    t.float    "penalty"
    t.integer  "previous_performance_id"
  end

  create_table "poets", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  create_table "rounds", force: :cascade do |t|
    t.integer  "num_poets"
    t.boolean  "is_cumulative"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.integer  "competition_id"
    t.string   "title"
    t.integer  "round_number"
    t.boolean  "are_poets_from_previous"
    t.integer  "time_limit"
    t.integer  "num_places"
    t.integer  "grace_period"
    t.integer  "previous_round_number"
  end

  create_table "scorekeepers", force: :cascade do |t|
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "user_name"
    t.string   "password_digest"
  end

  create_table "settings", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.string   "web_sock_uri"
  end

end
