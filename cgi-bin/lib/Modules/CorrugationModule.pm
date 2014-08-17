package Modules::CorrugationModule;

use strict;
use warnings;
use YAML;

use constant TRUE => 1;
use constant FALSE => 0;

my @headerOrder = (
    "jobName",
    "jobCode",
    "numberRequested",
    "startTime",
    "endTime",
    "numberCompleted"
);

my %headers = (
    "jobName" => {
        displayName => "Job Name",
        type => "string",
        unique => 1,
        mandatory => 1,
        id => "jobName"
    },
    "jobCode" => {
        displayName => "Job Code",
        type => "string",
        mandatory => 1,
        id => "jobCode"
    },
   "numberRequested" => {
        displayName => "No of Liners /3 & 5 Ply Boards to be manufacture",
        type => "number",
        mandatory => 1,
        id => "numberRequested"
    },
    "startTime" => {
        displayName => "Job put on machine at",
        type => "time",
        id => "startTime"
    },
    "endTime" => {
        displayName => "Job put off machine at",
        type => "time",
        id => "endTime"
    },
    "numberCompleted" => {
        displayName => "No of Liners /3 & 5 Ply Boards manufactured",
        type => "number",
        id => "numberCompleted"
    }
);

my @machines = (
    'NIKKO DIE CUT MACHINE',
    'MANUAL BIG CUT MACHINE-I',
    'MANUAL BIG CUT MACHINE-II',
    'MANUAL BIG CUT MACHINE-III',
    'MANUAL SMALL CUT MACHINE-I'
);

sub new {
    my $class = shift;
    my $self;
    $self = bless {}, $class;
    return $self;
}

sub get_jobs {
    my $self = shift;
    my $args = shift;
    
    if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }
    
    if (!$$args{'date'}) {
        return {code => 400, content => "date missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    
    if(!-e $file) {
    	system("cp data/modules/$$args{'module'}/template.yaml $file");
    }
    
    -e $file || return { code => 404, content => "No information found for $$args{'module'} for date $$args{'date'}"};
    my $data = YAML::LoadFile($file);
    
    return { code => 200, content => $data};
}

sub get_headers {
    my $self = shift;
    
    my $data = [];
    foreach my $h (@headerOrder) {
        push(@{$data}, $headers{$h});
    }
    return { code => 200, content => $data};
}

sub add_job {
    my $self = shift;
    my $args = shift;
    
    if (!defined $args->{'module'}) {
        return {code => 400, content => "module is missing"}
    }
    
    if (!defined $args->{'category'}) {
        return {code => 400, content => "category is missing"}
    }
    
    foreach my $mField(keys %headers) {
        next if(!$headers{$mField}{'mandatory'});
        if (!defined $args->{$mField}) {
            return {code => 400, content => "$mField is mandatory"}
        }
    }
    
    if (!defined $args->{'date'}) {
        return {code => 400, content => "date is missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    
    my $data = YAML::LoadFile($file);
    if ($self->is_locked($file)) {
        return {code => 409, content => "someone else is editing this too. Please try in some seconds."}
    }
    
    $self->lock_file($file);
    #return {code => 200, content => $data};
    foreach my $d (@{$data}) {
        my $category = (keys %{$d})[0];
        if ($category eq $args->{'category'}) {
            foreach my $job (@{$d->{$category}}) {
                if ($job->{'jobName'} eq $args->{'jobName'}) {
                    $self->release_file($file);
                    return {code => 409, content => $args->{'jobName'}." already exists."}
                }
            }
            my %temp = ();
            foreach my $h (keys %headers) {
            	if(defined $args->{$h}) {
            	    $temp{$h} = $args->{$h};
            	} else {
            	    $temp{$h} = "";
            	}
            }
            
            push(@{$d->{$category}}, \%temp);
            YAML::DumpFile($file, $data);
            $self->release_file($file);
            return {code => 200, content => "updated successfully"};
        }
    }
    $self->release_file($file);
    return {code => 400, content => "category: ".$args->{'category'}." not found for module: ".$args->{'module'}}
}

sub edit_job {
    my $self = shift;
    my $args = shift;
    
    if (!defined $args->{'module'}) {
        return {code => 400, content => "module is missing"}
    }
    
    if (!defined $args->{'category'}) {
        return {code => 400, content => "category is missing"}
    }
    
    foreach my $mField(keys %headers) {
        next if(!$headers{$mField}{'mandatory'});
        if (!defined $args->{$mField}) {
            return {code => 400, content => "$mField is mandatory"}
        }
    }
    
    if (!defined $args->{'date'}) {
        return {code => 400, content => "date is missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    
    my $data = YAML::LoadFile($file);
    if ($self->is_locked($file)) {
        return {code => 409, content => "someone else is editing this too. Please try in some seconds."}
    }
    
    $self->lock_file($file);
    #return {code => 200, content => $data};
    foreach my $d (@{$data}) {
        my $category = (keys %{$d})[0];
        if ($category eq $args->{'category'}) {
            foreach my $job (@{$d->{$category}}) {
                if ($job->{'jobName'} eq $args->{'jobName'}) {
                    foreach my $h (keys %headers) {
                        if(defined $args->{$h}) {
                            $job->{$h} = $args->{$h};
                        }
                    }
            
                    YAML::DumpFile($file, $data);
                    $self->release_file($file);
                    return {code => 200, content => "updated successfully"};
                }
            }
            $self->release_file($file);
            return {code => 400, content => $args->{'jobName'}." not found in ". "category: ".$args->{'category'}.", module: ".$args->{'module'}}
        }
    }
    $self->release_file($file);
    return {code => 400, content => "category: ".$args->{'category'}." not found for module: ".$args->{'module'}}
}

sub delete_job {
    my $self = shift;
    my $args = shift;
    
    my @mandatory = ("jobName");
    
    if (!defined $args->{'module'}) {
        return {code => 400, content => "module is missing"}
    }
    
    if (!defined $args->{'category'}) {
        return {code => 400, content => "category is missing"}
    }
    
    foreach my $mField(@mandatory) {
        if (!defined $args->{$mField}) {
            return {code => 400, content => "$mField is mandatory"}
        }
    }
    
    if (!defined $args->{'date'}) {
        return {code => 400, content => "date is missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    
    my $data = YAML::LoadFile($file);
    if ($self->is_locked($file)) {
        return {code => 409, content => "someone else is editing this too. Please try in some seconds."}
    }
    
    $self->lock_file($file);
    #return {code => 200, content => $data};
    foreach my $d (@{$data}) {
        my $category = (keys %{$d})[0];
        if ($category eq $args->{'category'}) {
            my $index = 0;
            foreach my $job (@{$d->{$category}}) {
                if ($job->{'jobName'} eq $args->{'jobName'}) {
                    splice(@{$d->{$category}}, $index, 1);
                    #$d->{$category}->[$index] = undef;
                    YAML::DumpFile($file, $data);
                    $self->release_file($file);
                    return {code => 204, content => "deleted successfully"}
                }
                $index++;
            }
            $self->release_file($file);
            return {code => 400, content => $args->{'jobName'}." not found in ". "category: ".$args->{'category'}.", module: ".$args->{'module'}}
        }
    }
    $self->release_file($file);
    return {code => 400, content => "category: ".$args->{'category'}." not found for module: ".$args->{'module'}}
}

sub is_locked {
    my $self = shift;
    my $file = shift;
    
    my $lock = $file.".lock";
    if (-e $lock) {
        return TRUE;
    }
    return FALSE;
}

sub lock_file {
    my $self = shift;
    my $file = shift;
    
    my $lock = $file.".lock";
    open(F, ">$lock");
    close F;
}

sub release_file {
    my $self = shift;
    my $file = shift;
    
    my $lock = $file.".lock";
    unlink $lock;
}

1;