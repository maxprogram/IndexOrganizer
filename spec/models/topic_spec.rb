# == Schema Information
#
# Table name: topics
#
#  id         :integer          not null, primary key
#  level      :integer
#  name       :string(255)
#  pages      :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'spec_helper'

describe Topic do
  pending "add some examples to (or delete) #{__FILE__}"
end
